// @flow
import React from "react";

import ContrailsLayout from "../components/ContrailsLayout";
import {
    ContrailPanelsContainer,
    ContrailPanelsTop,
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
} from "../components/ContrailPanels";
import ProfilerChartWithMinimap from "../components/ProfilerChartWithMinimap";
import TreeGrid from "../components/TreeGrid";

type ContrailsApplicationProps = void;

type ContrailsApplicationState = {};

const item1 = {
    value1: "value 1",
    value2: "value 1",
    children: [
        {
            value1: "value 1 2",
            value2: "value 1 2",
        },
        {
            value1: "value 1 2",
            value2: "value 1 2",
        },
    ],
};

export default class ContrailsApplication extends React.Component {
    props: ContrailsApplicationProps;
    state: ContrailsApplicationState;

    render(): React.Element<*> {
        return (
            <ContrailsLayout>
                <ContrailPanelsContainer>
                    <ContrailPanelsTop>
                        <ProfilerChartWithMinimap
                            from={0}
                            to={10}
                            data={{
                                lines: [
                                    {
                                        items: [{ from: 0, to: 10, name: "123" }],
                                    },
                                    {
                                        items: [{ from: 0, to: 2, name: "123" }, { from: 2.1, to: 3.993, name: "123" }],
                                    },
                                    {
                                        items: [{ from: 0.5, to: 2, name: "123" }, { from: 2.6, to: 3.9, name: "123" }],
                                    },
                                    {
                                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                                    },
                                    {
                                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                                    },
                                    {
                                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                                    },
                                ],
                            }}
                        />
                    </ContrailPanelsTop>
                    <ContrailPanelsBottom>
                        <ContrailPanelsBottomLeft>
                            <TreeGrid
                                columns={[
                                    {
                                        name: "Value 1",
                                        renderHeader: () => "Value 1",
                                        renderValue: x => x.value1,
                                    },
                                    {
                                        name: "Value 2",
                                        renderHeader: () => "Value 2",
                                        renderValue: x => x.value2,
                                    },
                                ]}
                                focusedItem={null}
                                data={[
                                    item1,
                                    {
                                        value1: "value 1",
                                        value2: "value 1",
                                        children: [
                                            {
                                                value1: "value 1 2",
                                                value2: "value 1 2",
                                            },
                                            {
                                                value1: "value 1 2",
                                                value2: "value 1 2",
                                                children: [
                                                    {
                                                        value1: "value 1 2",
                                                        value2: "value 1 2",
                                                    },
                                                    {
                                                        value1: "value 1 2",
                                                        value2: "value 1 2",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ]}
                            />{" "}
                        </ContrailPanelsBottomLeft>
                        <ContrailPanelsBottomRight>Right</ContrailPanelsBottomRight>
                    </ContrailPanelsBottom>
                </ContrailPanelsContainer>
            </ContrailsLayout>
        );
    }
}
