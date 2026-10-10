import { createWidget } from "./feature";
import { Base } from "./base";

export * from "./feature";
export * from "./item";

export const widget = createWidget(Base);
