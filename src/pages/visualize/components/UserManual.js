import React from 'react';
import CustomMenuItem from './CustomMenuItem';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function UserManual() {

    return (
        <CustomMenuItem>
            <Paragraph style={{ lineHeight: '120%' }}>Welcome to the user manual! Here you can find some information about this page and how it works.</Paragraph>
            <Title level={3}>General Options</Title>
            <Paragraph style={{ lineHeight: '120%' }}>
                Before you start looking at visualisations, you should adjust the General Options to your liking.
                You can choose primary graph you want to display and optionally also a graph to display beside it.
                You can also choose a timeframe which filters out all data that doesn&apos;t fit in that timeframe.
            </Paragraph>
            <Title level={3}>The viewport</Title>
            <Paragraph style={{ lineHeight: '120%' }}>
                The viewport is the section where the graph is displayed.
                Here you can interact with the graph in different ways, but that is discussed in their specific sections.
                When 2 graphs are selected in the general settings, the viewport is split in half vertically.
                In this situation there are 2 viewports besides eachother, 1 for each visualisation.
                In the top left part of the viewport the name of the current visualisation is displayed.
                In the top right there is an info button, which displays information about the current graph when you hover over it.
                In the bottom right corner you can find a save button, which allows you to save the currently displayed graph as a picture.
                At the bottom of the viewport there is a timeline, but that is discussed in its own section.
            </Paragraph>
            <Title level={3}>Hierarchical Edge Bundling</Title>
            <Paragraph style={{ lineHeight: '120%' }}>
                Edges may be colored differently based on sentiment, sender&apos;s jobtitle, or receiver&apos;s job title.
                Similarly, nodes may be colored based on one of the following options: average, minimum,
                or maximum sentiment or sender&apos;s jobtitle.
                The edge thickness may be increased or decreased by use of the slider, and the edge bundling factor may be modified
                likewise. These options may be found under &apos;Options For Graph&apos; on the sidebar.</Paragraph>
            <Title level={3}>(Disjoint) Force Directed Graph</Title>
            <Paragraph style={{ lineHeight: '120%' }}>
                Nodes may be colored based on job title, and resized by use of a slider, degree, and node scale factor
                (which may also be increased or decreased by slider). Edges may be resized in a similar fasion by using the slider,
                and through frequence or scale factor (may be changed through a slider).
                    These options may be found under &apos;Options For Graph&apos; on the sidebar.</Paragraph>
            <Title level={3}>Timeline</Title>
            <Paragraph style={{ lineHeight: '120%' }}>
                At the bottom of the viewport you can find the timeline. Here you can move through the timeframe you selected in the General Options.
                The timeline is represented with 2 nodes. The first represents the start of the timeline and the other one the end of the timeline.
                You can drag both of them individually over the timeline with your mouse to move through the timeline.
                You can also use the play button to automatically move through the nodes.
                The play button is located at the bottom center of the viewport.
                In the bottom left corner there are 2 locks present, whith which you can control which nodes move when you press the play button.
                You can also use the buttons next to the play button to move a single day (single arrow) or move to the next change (double arrow).
                In the bottom right you can select the speed at which the nodes move when you press the play button.
            </Paragraph>
        </CustomMenuItem>
    );
}