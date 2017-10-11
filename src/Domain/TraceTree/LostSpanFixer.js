// @flow
import moment from "moment";
import _ from "lodash";

type SpanBase = {
    SpanId: string,
    ParentSpanId?: ?string,
    BeginTimestamp: string,
    EndTimestamp: string,
};

export type SpanFactory<T> = (spanId: string, parentSpanId: ?string, beginTimestamp: string, endTimestamp: string) => T;

export default class LostSpanFixer {
    fix<T: SpanBase>(spans: Array<T>, createFakeSpan: SpanFactory<T>): Array<T> {
        let result = [...spans];
        const spanIds = spans.map(x => x.SpanId);
        result = this.fixParentSpanIfNeed(result, createFakeSpan);
        const lostSpans = spans.filter(x => x.ParentSpanId != null).filter(x => !spanIds.includes(x.ParentSpanId));
        for (const lostSpan of lostSpans) {
            const parentSpanId = lostSpan.ParentSpanId;
            const mostSuitableParent = this.findMostSuitableParent(result, lostSpan);
            if (mostSuitableParent == null) {
                continue;
            }
            if (parentSpanId == null) {
                throw new Error("InvalidProgramState");
            }
            const fakeSpan = createFakeSpan(
                parentSpanId,
                mostSuitableParent.SpanId,
                lostSpan.BeginTimestamp,
                lostSpan.EndTimestamp
            );
            result.push(fakeSpan);
        }
        return result;
    }

    fixParentSpanIfNeed<T: SpanBase>(spans: Array<T>, createFakeSpan: SpanFactory<T>): Array<T> {
        if (spans.find(x => x.ParentSpanId == null) != null) {
            return spans;
        }
        return [
            ...spans,
            createFakeSpan(
                "FakeRootSpanId",
                null,
                _.minBy(spans, x => moment(x.BeginTimestamp).toDate()).BeginTimestamp,
                _.maxBy(spans, x => moment(x.EndTimestamp).toDate()).EndTimestamp
            ),
        ];
    }

    findMostSuitableParent<T: SpanBase>(spans: Array<T>, target: T): ?T {
        const potentialParents = spans.filter(x => x !== target).filter(x => this.isSpanCanBeParent(x, target));
        const sorted = _.sortBy(potentialParents, x => this.getDifferenceBetween(x, target));
        if (sorted.length === 0) {
            return null;
        }
        return sorted[0];
    }

    isSpanCanBeParent<T: SpanBase>(span: T, target: T): boolean {
        return (
            moment(span.BeginTimestamp).toDate() <= moment(target.BeginTimestamp).toDate() &&
            moment(span.EndTimestamp).toDate() >= moment(target.EndTimestamp).toDate()
        );
    }

    getDifferenceBetween<T: SpanBase>(span: T, target: T): number {
        const parentDuration =
            moment(span.EndTimestamp).toDate().getTime() - moment(span.BeginTimestamp).toDate().getTime();
        const targetDuration =
            moment(target.EndTimestamp).toDate().getTime() - moment(target.BeginTimestamp).toDate().getTime();
        return parentDuration - targetDuration;
    }
}
