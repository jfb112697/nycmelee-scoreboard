import { Component } from "solid-js";
import { Card, CardHeader, CardTitle } from "./ui/card";

const LowerThird = () => {

    return (
        <Card class="flex flex-col justify-between w-full">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Lower Third</CardTitle>
            </CardHeader>
        </Card>
    );
};

export default LowerThird;