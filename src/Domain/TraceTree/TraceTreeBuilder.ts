import moment from "moment";

import { NotImplementedError } from "../../Commons/Errors";
import { IDataExtractor } from "../IDataExtractor";
import { SpanInfo } from "../SpanInfo";

import {SpanNode, Status} from "./SpanNode";

export class TraceTreeBuilder {
    public dataExtractor: IDataExtractor;

    public constructor(dataExtractor: IDataExtractor) {
        this.dataExtractor = dataExtractor;
    }

    public buildTraceTree(spans: SpanInfo[]): SpanNode {
        const root = spans.find(x => x.ParentSpanId == undefined);
        if (root == undefined) {
            // TODO построить фековай item
            throw new NotImplementedError();
        }
        const resultRoot = this.spanInfoToSpanNode(root, spans);
        return resultRoot;
    }

    private spanInfoToSpanNode(span: SpanInfo, spans: SpanInfo[]): SpanNode {
        if (span.OperationName === "FakeSpan") {
            return {
                type: "FakeSpan",
                from: moment(span.BeginTimestamp).valueOf(),
                to: moment(span.EndTimestamp).valueOf(),
                status: Status.Fake,
                serviceName: "FakeSpan",
                spanTitle: "",
                source: span,
                children: spans
                    .filter(x => x !== span && x.ParentSpanId != undefined && x.ParentSpanId === span.SpanId)
                    .map(x => this.spanInfoToSpanNode(x, spans))
                    .sort((x, y) => x.from - y.from),
            };
        }
        return {
            type: "SingleSpan",
            from: moment(span.BeginTimestamp).valueOf(),
            to: moment(span.EndTimestamp).valueOf(),
            status: Status.Unknown,
            serviceName: this.dataExtractor.getServiceName(span),
            spanTitle: this.dataExtractor.getSpanTitle(span),
            source: span,
            children: spans
                .filter(x => x !== span && x.ParentSpanId != undefined && x.ParentSpanId === span.SpanId)
                .map(x => this.spanInfoToSpanNode(x, spans))
                .sort((x, y) => x.from - y.from),
        };
    }
}
