import { FillProps } from './types';
export default function extractFill(props: FillProps, styleProperties: string[]): {
    fill: (string | number)[] | null;
    fillRule: number;
    fillOpacity: number;
};
