import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import Roles from "../screens/admin/roles";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Roles">
                <Roles/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;