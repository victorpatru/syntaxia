import {
  railwayFullstackProduct,
  stripeCoreTechnology,
  vercelProductEngineerV0,
} from "./descriptions";

export interface JobDescriptionPreset {
  id: string;
  label: string;
  description: string;
}

export const PRIMARY_PRESET_COUNT = 3;

export const JD_PRESETS: JobDescriptionPreset[] = [
  {
    id: "railway-fullstack-product",
    label: "Railway — Full-Stack Engineer (Product Engineering)",
    description: railwayFullstackProduct,
  },
  {
    id: "vercel-product-engineer-v0",
    label: "Vercel — Product Engineer v0",
    description: vercelProductEngineerV0,
  },
  {
    id: "stripe-core-technology",
    label: "Stripe — Backend Engineer, Core Technology",
    description: stripeCoreTechnology,
  },
];
