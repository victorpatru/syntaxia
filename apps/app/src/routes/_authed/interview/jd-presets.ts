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
    description: `Job description

Our core mission at Railway is to make software engineers higher leverage. We believe that people should be given powerful tools so that they can spend less time setting up to do, and more time doing.

At Railway, we believe that making tooling more accessible for build and deployment is one of the greatest possible productivity unlocks of our generation. We also believe that the major roadblock between us and our goal is strong interfacing paradigms.

If you’re looking to build an operating system for builders, we’d love to talk with you!

“Computer scientists have so far worked on developing powerful programming languages that make it possible to solve the technical problems of computation. Little effort has gone toward devising the language of interaction.”

- Donald Norman

Curious? Learn more in our blog post about this team and the great work they’re doing: Team Spotlight: Product Engineering

Want to learn about our work culture? Here is a three-part blog series that will help you see the unique ways our team works (Parts 1, 2, 3, and 4).

About the role

For this role, you will:

Build features end-to-end, from the UI in our dashboard to orchestrating workflows that interact with our microservices using Temporal.
Craft intuitive interfaces that allow our users to interface with powerful computing paradigms, with help from our design team.
Build TypeScript + GraphQL APIs with strong guarantees around modeling data, allowing both internal and external users to build against.
Write Engineering Requirement Documents to take something from idea, to defined tasks, to implementation, to monitoring it’s success.
Experience with, or at least the desire to learn Rust to contribute to our open-source repositories (CLI, Nixpacks, etc)
You may be oncall from time to time in this role
Some projects full-stack engineers have worked on in the past

Rebuild logging infrastructure to support 1B logs/day, from configuring ClickHouse to developing a brand new observability UI
Build Git for infrastructure and re-thinking how a project evolves over time
Build a tool for building user code into a deployable image using Nix packages. github.com/railwayapp/nixpacks
Create interfaces to visualize project infrastructure on a 2D canvas
Add support for migrating deployments with a volume from one region to another using Temporal
Create a marketplace for users to share re-usable pieces of infrastructure
This is a high impact, high agency role with direct effect on company culture, trajectory, and outcome.

About you

An ability to autonomously lead, design, and implement great product experiences, from front to back.
A strong understanding of frontend architecture to build interactivity-rich systems for fetching, mutating, and rendering data effectively
Experience managing complex asynchronous backend jobs for something like a build/deploy pipeline.
A desire to be a part of the entire project development process. From research gathering and planning, to implementation and monitoring
Great written and verbal communication skills for expressing ideas, designs, and potential solutions in mostly-asynchronous manner
We value and love to work with diverse persons from all backgrounds

Things to know

For better or worse, we're a startup; our team dynamics are different from companies of different sizes and stages.

We're distributed ALL across the globe, and that's only going to be more and more distributed. As a result, stuff is ALWAYS happening.
We do NOT expect you to work all the time, but you'll have to be diligent about your boundaries because the end of your day may overlap with the start of someone else's.
We're a small team, with high ownership, who are not only passionate about what we do, but seek to be exceptional as well. At the time of writing we're 21, serving hundreds of thousands of users. There's a lot of stuff going on, and a lot of ambiguity.
We want you to own it. We believe that ownership is a key to growth, and part of that growth is not only being able to make the choices, but owning the success, or failure, that comes with those choices.
Benefits and perks

At Railway, we provide best in class benefits. Great salary, full health benefits including dependents, strong equity grants, equipment stipend, and much more. For more details, check back on the main careers page.

Beyond compensation, there are a few things that we believe that make working at Railway truly unique:

Autonomy: We have very few meetings. Just a Monday and a Friday to go over the Company Board. We think your time is sacred, whether it's at work, or outside of work.
Ownership: We're a company with a high ownership, high autonomy culture. We hope that you'll come in, help us, and over the course of many years do the best work of your life. When we bring you onboard, we expect you to change the company.
Novel problems/solutions: We're a startup that's well funded, with cool problems, which lets us implement novel solutions! We abhor “busywork” and think, whether it's community, engineering, operations, etc there's always opportunity for creative and high leverage solutions.
Growth: We want you to grow with us, but we know that talent is loaned, so when you figure out what area you want to grow in next, whether it's at Railway or outside, we'll make sure you land there.`,
  },
  {
    id: "vercel-platforms-fs",
    label: "Vercel — Sr. Full-Stack Engineer (Platforms)",
    description:
      "Vercel builds developer-first platforms around Next.js and edge runtimes. We are hiring a Senior Full-Stack Engineer to deliver high-quality experiences across React/TypeScript, Node.js, serverless/edge functions, routing, caching/CDN layers, and performance tooling. You will collaborate with product and design to ship reliable, scalable features that improve DX and platform extensibility.",
  },
  {
    id: "stripe-payments-reliability",
    label: "Stripe — Sr. Backend Engineer (Payments Reliability)",
    description:
      "Stripe processes global payments at scale. We are looking for a Senior Backend Engineer to own distributed services with high availability and strong consistency guarantees. Experience with JVM or Go services, queueing, idempotency, data modeling, observability, SLOs/SLIs, and incident management is required. You will lead reliability initiatives and partner closely with product to improve resiliency.",
  },
  {
    id: "openai-systems-production",
    label: "OpenAI — Sr. Systems Engineer (Production)",
    description:
      "OpenAI operates large-scale systems for inference and training. We are hiring a Senior Systems Engineer to design, build, and operate production infrastructure with strong reliability and security. Experience with GPU scheduling, networking, infra-as-code, Linux systems, observability, and security best practices is required. You will improve performance, reduce latency, and maintain strict operational standards.",
  },
];
