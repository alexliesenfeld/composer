import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ProjectStore} from "@/renderer/app/stores/projectStore";

const ProjectsPage = (props: { projectStore?: ProjectStore }) => {
    return (
        <a>asdasd</a>
    );
};

export default inject('projectStore')(observer(ProjectsPage))
