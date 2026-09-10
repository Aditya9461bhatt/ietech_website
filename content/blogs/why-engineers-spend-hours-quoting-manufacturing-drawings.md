---
title: Why Does It Still Take an Engineer Hours to Quote a Manufacturing Drawing?
date: September 9, 2026
dateISO: "2026-09-09T00:00:00.000Z"
category: Quotation Automation
excerpt: "Why i.e. Quotient exists: the engineering reasoning behind faster, more accurate manufacturing quotations."
image: /uploads/quotient-manufacturing-drawing.png
authorName: Jayraj Parmar
authorEmail: ceojayraj@ietech.ai
status: published
---

*The problem that led us to build i.e. Quotient — and why automating manufacturing quotations turned out to be much harder than automating a spreadsheet.*

i.e. Quotient did not start with us sitting in a room trying to think of another AI product.

It started with a manufacturer asking us a fairly simple question.

Can you help us prepare quotations faster, without taking so much of our engineers’ time?

The request came from the owner of Gautam Group.

Their problem wasn’t that they couldn’t prepare quotations.

They already had engineers who knew exactly how to do it.

That was actually the problem.

Experienced engineering time was being spent repeatedly doing work that followed a similar pattern: opening drawings, understanding the component, checking whether the company could manufacture it, selecting the process, estimating machining time, doing calculations in Excel and eventually arriving at a quotation.

Those engineers could have been working on production problems, new product development, process improvement or difficult engineering decisions.

Instead, a significant part of their time was being consumed before the company had even won the order.

That became the starting point for i.e. Quotient.

## What happens when an RFQ arrives

The quotation process looks simple from the outside.

A customer sends a drawing.

The manufacturer sends back a price.

There is a lot hidden between those two events.

At Gautam, an RFQ normally begins with an email from the customer.

The marketing person receives it first.

They then pass the RFQ to an engineer.

Before anyone can seriously talk about price, the engineer has to answer some basic questions.

Can we manufacture this part?

Do we work with this material?

Is the requested quantity sensible for our process?

What operations will be required?

Which machines can make it?

How long will those operations take?

Only after that does costing really begin.

For machining calculations, engineers were using Excel to work out things such as cut length, feed, speed and machining time.

None of these calculations are particularly mysterious on their own.

The difficulty is knowing which calculation to perform in the first place.

A drawing does not arrive saying:

> Turn this diameter on Machine A using Tool B for this much cut length, followed by this operation, with this setup time.

It arrives as an engineering drawing.

Someone has to understand it.

That is where most of the intelligence sits.

## We initially thought quotation automation was a calculation problem

It isn’t.

Calculation is probably one of the easier parts.

If you already know the operation, diameter, cut length, feed and speed, calculating an approximate machining time is manageable.

The difficult question is:

How did you know that was the operation?

That question led us much deeper into the problem than we originally expected.

To automate a manufacturing quotation properly, the software has to move through several layers of engineering reasoning.

It has to read the drawing.

Then understand what it read.

Then understand the geometry behind a 2D representation.

Then identify manufacturable features.

Then decide what manufacturing operations those features imply.

Only then can it start deciding machines, tools, setups, time and cost.

That is a very different problem from putting an AI interface on top of an Excel sheet.

## The first problem was simply reading the drawing correctly

Engineering drawings contain an enormous amount of information in a very compressed form.

Dimensions.

Tolerances.

Surface-finish requirements.

Materials.

Notes.

Datums.

Geometric tolerances.

Section views.

Detail views.

Different line types.

Symbols.

And, of course, geometry.

Humans who have read engineering drawings for years barely notice how much interpretation they are doing.

They look at a drawing and mentally reconstruct the part.

Software doesn’t automatically have that intuition.

So one of our first problems was drawing reading and classification.

What kind of drawing are we looking at?

Where are the different views?

Which dimensions belong to which features?

Which text is manufacturing information and which text is something else?

Even drawing ballooning — identifying and numbering the characteristics that need to be inspected — requires understanding the relationship between dimensions and the part.

Today, Quotient can work through this process and also generate the ballooned drawing and quality sheet as part of the RFQ workflow.

But getting there required us to solve the problem layer by layer.

## Reading dimensions isn’t the same as understanding geometry

This became our second major problem.

You can extract numbers from a drawing and still understand almost nothing about the component.

Suppose the drawing contains several diameters.

Which one represents raw stock?

Which one is an outside diameter that needs turning?

Which one belongs to a bore?

Is there a shoulder between two diameters?

Is the feature visible in the front view, section view or another projection?

Two dimensions that look independent on paper may actually describe the same physical feature from different views.

A manufacturing engineer handles these relationships almost instinctively.

For software, we have to reconstruct them.

And this is where the fact that much of the manufacturing industry still works with 2D drawings becomes important.

## A 3D model with PMI would make this problem much easier

A lot of modern engineering software talks about model-based definition and Product Manufacturing Information — PMI.

In that world, the 3D model itself carries much of the manufacturing information.

The geometry already exists as geometry.

Features have spatial relationships.

Dimensions and tolerances can be associated directly with the model.

That is an excellent environment for automation.

But it isn’t the environment we can assume our customers live in.

A large amount of real RFQ activity still happens through PDF drawings.

Sometimes a STEP model is supplied.

Very often it isn’t.

So if we want Quotient to be useful in the manufacturing industry that exists today, rather than the manufacturing industry we wish existed, it has to work with 2D drawings.

That makes geometry reconstruction and feature understanding substantially harder.

When a proper 3D model with PMI is available, we expect geometry and feature understanding to become considerably more reliable.

But we can’t make that a requirement.

If the customer sends a PDF drawing, the system still has to try to understand the job.

## After geometry comes the question that actually matters: how would we manufacture it?

Recognising a cylindrical feature isn’t enough.

The software has to make a manufacturing decision.

Does it need turning?

Facing?

Boring?

Drilling?

Milling?

Grinding?

What sequence makes sense?

What should happen in one setup?

What needs another setup?

What machine can perform those operations?

That became the next layer of Quotient.

Our architecture is therefore not one giant AI model that receives a PDF and magically produces a quotation.

We break the problem down.

At a high level, the system works more like this:

Engineering Drawing / STEP

↓

Drawing understanding and classification

↓

Geometry reconstruction

↓

Manufacturing feature extraction

↓

Operation and route planning

↓

Machine, tool and setup selection

↓

Cut length + machining calculations

↓

Cycle-time estimation

↓

Costing

↓

Quotation

Alongside that, the drawing-understanding layer can support ballooning and the preparation of the quality sheet.

There is AI involved in several parts of this system, but there are also deterministic engineering calculations and company-specific manufacturing rules.

That distinction is important.

I don’t think everything in engineering should be solved by asking a language model.

If an engineering equation is known, use the equation.

If a company’s machine has a defined operating range, use that constraint.

If cutting parameters can be calculated from structured data, calculate them.

Use AI where interpretation and reasoning are required.

Use engineering logic where engineering logic is more reliable.

## The system also has to understand your factory

There is another reason quotation automation is difficult.

There isn’t one universally correct manufacturing plan for a part.

Imagine two companies receiving exactly the same drawing.

Company A has a particular CNC lathe.

Company B has a VTL and a different range of tooling.

Company A may have a fixture already available.

Company B may need a new setup.

Their machine rates are different.

Their material purchasing rates are different.

Their operators work differently.

Their historical cycle times are different.

Their preferred manufacturing routes may be different.

So Quotient cannot only understand the part.

It also has to understand the manufacturing environment in which that part will be made.

That means connecting the reasoning system with company-specific information such as:

- available machines

- machine capabilities

- tools

- fixtures

- material rates

- machine-hour rates

- process rules

- historical quotations

- preferred manufacturing methods

- actual past production performance

That is where I think this product becomes more interesting over time.

The objective isn’t simply:

“What does this drawing contain?”

It is:

“Given this drawing and this factory, how would this company manufacture the part?”

Those are very different questions.

## We have already been wrong — and that has been useful

One thing I don’t want to do while writing about this product is pretend that the problem is solved.

It isn’t.

i.e. Quotient is currently under co-development and testing with Gautam Group.

Some parts of the system have become significantly more reliable than they were at the beginning.

Machine selection, for example, is largely under control now.

But other parts are still active engineering problems.

Right now, one of the areas we are working on is calculating cut length correctly across different geometries and operations, along with handling overlaps between features.

Cycle-time estimation is another major area.

At the moment, our cycle-time accuracy is only around 40–50% across the jobs we are working with.

That isn’t good enough.

Our target is to bring this above 80–90% across the types of jobs the system is expected to handle.

That means testing against real quotations, finding where the reasoning or calculation failed, correcting it and trying again.

There is no point hiding that.

Manufacturing companies make financial decisions based on these numbers.

A quotation that looks impressive in a demo but consistently gives the wrong machining time isn’t useful.

Accuracy matters more than the demo.

## Why we still believe the productivity gain can be large

We haven’t deployed Quotient widely enough yet to claim measured productivity numbers.

So I don’t want to say:

“Quotient has already reduced quotation time by 8×.”

We haven’t demonstrated that yet.

But based on the workflow we are automating, we expect the completed system to make the quotation process roughly 5–8 times more productive for the kinds of RFQs it can handle.

The reason is straightforward.

Today an experienced engineer may have to personally perform almost every step.

With Quotient, the goal is for the system to do the first pass:

Read the drawing.

Extract the relevant information.

Understand the geometry.

Identify the features.

Suggest the process route.

Select suitable machines and tools.

Calculate machining parameters and time.

Prepare costing.

Balloon the drawing.

Prepare the quality sheet.

Then the engineer reviews the result instead of constructing everything from zero.

That distinction is important.

We are not trying to remove the engineer from the process.

We are trying to change where the engineer spends time.

Instead of spending valuable engineering hours repeatedly calculating jobs that follow familiar patterns, the engineer should spend time on the cases where engineering judgement is actually valuable.

Unusual geometry.

Difficult tolerances.

New processes.

Feasibility problems.

Tooling decisions.

Process optimization.

Jobs where experience genuinely changes the outcome.

## This is why I don’t think quotation automation is really a CPQ problem

Traditional CPQ — Configure, Price, Quote — works extremely well when the product can be configured from known options.

Manufacturing RFQs are different.

A job shop may receive a drawing it has never seen before.

The quotation system first has to determine what the product is, how it can be manufactured and how much manufacturing effort it represents.

Only then can it price it.

So the difficult part isn’t the Q in quotation.

It is everything before the quotation.

Drawing understanding.

Geometry.

Manufacturing knowledge.

Process planning.

Machine selection.

Time estimation.

That is the engineering layer we are trying to automate with i.e. Quotient.

## The part of this project I find most interesting

When we started, I thought we were building quotation software.

I’m not sure I would describe it that way anymore.

Quotation is simply the first useful output.

If the system can genuinely understand a manufacturing drawing and determine how a factory would produce that component, the same knowledge can eventually be useful elsewhere.

Process planning.

Production planning.

Quality planning.

Cost estimation.

DFM.

Machine selection.

Tool planning.

And eventually feedback from actual production can improve the original estimate.

If we estimated that an operation would take 18 minutes and the ERP later tells us that similar jobs consistently take 23 minutes, that difference is valuable information.

The next quotation should know about it.

That’s the longer-term direction.

Not an AI that produces a convincing-looking quotation.

A manufacturing system that gradually gets better at understanding how a particular factory makes things.

We are still a long way from solving that completely.

But that is the problem we are working on with i.e. Quotient.

And it started with a manufacturer asking a very sensible question:

Why are my engineer spending so much of their time preparing quotations?

---

*Originally published on Medium: [read the original article](https://medium.com/@ceojayraj/why-does-it-still-take-an-engineer-hours-to-quote-a-manufacturing-drawing-35ec444d828d).*
