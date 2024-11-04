import NodeContainer from "@/components/nodecontainer/NodeContainer";
import {
    city,
    city2,
    continents,
    countries_indicators,
    culinary,
    databubble,
    gdp,
    radar,
    sex,
    ufo_signhtings,
} from "@/data";
import { DatabaseOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React, { ChangeEvent, FC, useEffect, useState } from "react";

interface ExampleDataProps {
    onCallback: (data: { [key: string]: any }) => void;
    data: any;
}

const ExampleData: React.FC<ExampleDataProps> = ({ onCallback, data }) => {
    const [option, setOption] = useState<string>("");

    useEffect(() => {
        var value = data?.input?.option ?? "countries_indicators";
        (async function () {
            const output = await fakeApi(value);
            setOption(value);
            onCallback({ output, input: { option: value } });
        })();
    }, [data, onCallback]);

    async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        const output = await fakeApi(value as ApiOption);
        setOption(value);
        onCallback({ output, input: { option: value } });
    }

    return (
        <Card>
            <select value={option} onChange={handleChange}>
                <option value="countries_indicators">
                    Countries Indicator
                </option>
                <option value="culinary">Culinary</option>
                <option value="radar">Radar</option>
                <option value="data-bubble">Data Bubble</option>
                <option value="sex">Sex</option>
                <option value="city">Citys</option>
                <option value="city2">2 City</option>
                <option value="ufo_signhtings">UFO Sightings</option>
                <option value="continents">Continents</option>
                <option value="gdp">GDP</option>
            </select>
        </Card>
    );
};

interface SidebarProps {
    onDragStart: (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string,
    ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
    return (
        <div
            className="dndnode"
            onDragStart={(event) => onDragStart(event, "example-data")}
            draggable
        >
            <DatabaseOutlined /> Example Data
        </div>
    );
};

type ApiOption =
    | "countries_indicators"
    | "ufo_signhtings"
    | "continents"
    | "gdp"
    | "city"
    | "city2"
    | "data-bubble"
    | "culinary"
    | "sex"
    | "radar";

type ApiResponse =
    | typeof countries_indicators
    | typeof ufo_signhtings
    | typeof continents
    | typeof gdp
    | typeof city
    | typeof city2
    | typeof databubble
    | typeof culinary
    | typeof sex
    | typeof radar
    | [];

async function fakeApi(option: ApiOption): Promise<ApiResponse> {
    switch (option) {
        case "countries_indicators":
            return countries_indicators;
        case "ufo_signhtings":
            return ufo_signhtings;
        case "continents":
            return continents;
        case "gdp":
            return gdp;
        case "city":
            return city;
        case "city2":
            return city2;
        case "data-bubble":
            return databubble;
        case "culinary":
            return culinary;
        case "sex":
            return sex;
        case "radar":
            return radar;
        default:
            return [];
    }
}

interface ExampleDataWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id?: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const ExampleDataWrapper: React.FC<ExampleDataWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer {...props} label="Nhập File">
            <ExampleData onCallback={props.onCallback} data={props.data} />
        </NodeContainer>
    );
};

ExampleDataWrapper.Sidebar = Sidebar;
