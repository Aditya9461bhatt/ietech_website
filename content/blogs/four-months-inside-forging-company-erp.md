---
title: Four Months Inside a Forging Company Changed How I Think About ERP
date: September 9, 2026
dateISO: "2026-09-09T00:00:00.000Z"
category: Manufacturing ERP
excerpt: What implementing ERP at Tirupati Forge taught us about adoption, stock visibility, and supporting a real factory.
image: /uploads/forging-erp-implementation.png
authorName: Jayraj Parmar
authorEmail: ceojayraj@ietech.ai
status: published
---

*What Implementing ERP Inside a Forging Company Actually Taught Me*

## Four months inside Tirupati Forge changed the way I think about ERP implementation in manufacturing.

When we started implementing ERP at Tirupati Forge, I knew the software side would take work.

What I underestimated was everything around the software.

The company had been running largely through Excel sheets, handwritten registers, conversations between people, and the experience of employees who already knew how things worked.

From the outside, replacing some of that with ERP sounds straightforward.

Understand the process. Configure the system. Train people. Go live.

Inside a working forging company, it is nowhere near that clean.

Production priorities change. Workload changes. People are already stretched. There may not be enough manpower to dedicate someone to ERP implementation. An employee who is supposed to sit with you for an hour may suddenly have something urgent to handle on the shop floor.

And even when the software is ready, people may simply avoid using it.

That was probably the biggest lesson for me.

An ERP implementation is not really about installing an ERP.

It is about getting a running company to change the way information moves through it without stopping the company from running.

## The factory does not stop because you are implementing ERP

One of the first things we had to accept was uncertainty.

When you make an implementation plan, everything looks structured.

Monday: understand stores.

Tuesday: production workflow.

Wednesday: sales.

Thursday: testing.

The factory has its own opinion about your plan.

An urgent order comes in.

Someone is absent.

Production needs attention.

A customer needs something.

A person you need for implementation is suddenly unavailable.

This was especially difficult because manpower itself was limited.

The same employees who were supposed to help us understand the process were also responsible for actually running that process.

We couldn’t simply tell someone:

“Today we need three hours with you for ERP.”

Their first responsibility was still production.

That changed how I started looking at ERP projects.

I had initially thought mostly in terms of software scope.

How many modules?

What configuration?

What customization?

What master data?

But implementation capacity is just as important as software scope.

A company may genuinely want an ERP and still struggle to implement it because there aren’t enough people available to absorb the change.

That is a very different problem from “the customer is not interested in ERP.”

## Before ERP, the system was Excel, registers — and people

Tirupati Forge was using Excel and handwritten registers for different parts of its operations.

That is common in manufacturing.

And I don’t think Excel or registers are automatically bad.

They often work surprisingly well for the person who created them.

Someone knows exactly which sheet contains the information.

Someone knows what a particular column actually means.

Someone knows that a number written in one register has to be checked against another register.

The problem starts when management wants one reliable picture of what is happening across the company.

Especially stock.

You may know how much raw material was purchased.

You may know how much finished material is available.

But manufacturing lives in the space between those two numbers.

Where is the rest of the material?

Is it in production?

At which stage?

How much is still WIP?

How much can actually be committed against an order?

That information was one of the areas we wanted the ERP to make much clearer.

And after implementation, one of the most useful changes was exactly that:

proper stock visibility.

Not a dramatic statement like “we increased productivity by 37%.”

We don’t have that number, and I don’t want to invent one.

But being able to look at the system and understand stock properly is itself a meaningful operational improvement.

In manufacturing, visibility comes before optimization.

If you don’t know what is happening, you can’t improve it intelligently.

## The biggest ERP problem wasn’t actually ERP

There was another problem that was harder than configuration.

People didn’t want to use the system.

Not because they were doing something wrong.

They simply weren’t used to working this way.

Imagine doing your work through registers and Excel for years and suddenly someone tells you that every important transaction has to go through a new system.

Now there are screens.

Fields.

Sequences.

Rules.

If one step is missed, something later may not work properly.

From the implementation team’s perspective, you may think:

“We already trained them. Why aren’t they entering the data?”

From the employee’s perspective, the old way was faster because they already knew it.

That gap matters.

We saw people sometimes avoiding ERP and continuing with the method they were comfortable with.

And this is where something interesting happened.

The solution didn’t come from another training session.

It came from management.

Top management started asking for reports through the ERP only.

That changed the situation.

If somebody came with information outside the system, the expectation became:

Show it in ERP.

That may sound like a small management decision.

For adoption, it was probably one of the most important decisions in the entire implementation.

Because suddenly the ERP was no longer an additional system.

It started becoming the system.

That distinction is huge.

You can train employees ten times, but if management continues accepting reports from Excel, WhatsApp, registers and ERP equally, people will naturally return to whatever is easiest for them.

Once management begins making decisions from ERP data, using ERP stops being optional.

This experience changed my view of user adoption.

ERP adoption is not mainly a software problem.

It is not even mainly a training problem.

It is a management behaviour problem.

If the top of the organization doesn’t use the ERP as the source of truth, the rest of the company has very little reason to treat it as one.

## Then we reached a problem the standard workflow didn’t solve well

Another useful lesson came from shipping.

Tirupati Forge needed to plan containers based on several pieces of information at the same time.

There was the sales order.

There was finished stock currently available.

And then there was material that wasn’t finished yet but was already somewhere in WIP.

Those three things needed to come together for shipping planning.

This is the kind of requirement that sounds obvious after someone explains it.

But it doesn’t always fit neatly into a standard ERP screen.

Management doesn’t only want to know:

“What is in stock?”

They may need to know:

“We have this customer order. This much quantity is ready. This much is still somewhere in production. Based on that, how should we plan the container?”

So we built a custom Container Planning module around that requirement.

It looks at the sales order, stock availability and stock currently in WIP to support the shipping plan.

This was one of the moments where implementation stopped being:

“Here is what the ERP can do.”

and became:

“Here is what this company actually needs to do. How should the software support it?”

I think that is an important difference.

There is a temptation in ERP implementation to force every business process into whatever already exists in the software.

Sometimes that is the right decision. Customization has a cost and too much of it can make an ERP difficult to maintain.

But the opposite extreme is also a mistake.

If there is an important operational process that does not fit the standard system, telling the company to simply work around the ERP defeats the purpose of implementing one.

The software should bring structure to the business.

The business shouldn’t have to perform unnecessary gymnastics just to satisfy the software.

## Manufacturing ERP looks very different once you follow the material

Another thing became clearer to me during this project.

ERP software is usually presented as modules.

Sales.

Purchase.

Inventory.

Production.

CRM.

Accounting.

But that is not how a factory works.

A piece of material doesn’t know that it has moved from the Purchase module to the Stock module and then to Manufacturing.

It just moves through the factory.

The customer order that started in sales eventually becomes a production requirement.

Production consumes material.

That material becomes WIP.

WIP eventually becomes finished stock.

Finished stock becomes part of a shipping plan.

Shipping is connected back to the customer’s order.

Physically, this is one continuous process.

Software divides it into modules because software needs structure.

During implementation, you have to reconnect those modules into the actual flow of the business.

That is why I now prefer asking:

“What happens next?”

rather than:

“Which module do we configure next?”

Follow the order.

Follow the material.

Follow the information.

Eventually, the ERP structure becomes much easier to understand.

## We also implemented CRM — but ERP was where the difficult behaviour change happened

Our scope at Tirupati Forge included ERP and CRM.

CRM is important because the commercial side of manufacturing cannot remain disconnected from operations.

But most of the difficult implementation lessons came from the operational side.

That is where a digital transaction has to match something that actually happened in the factory.

If the system says material moved but physically it didn’t, you have a problem.

If material physically moved but nobody updated the ERP, you also have a problem.

That is what makes manufacturing ERP different from implementing software where most activity already happens digitally.

The ERP is trying to create a digital representation of physical events.

People have to keep those two worlds synchronized.

And that takes discipline.

## Four months later, my definition of a successful ERP implementation had changed

When we began, success naturally looked like getting the software configured and running.

By the end, I was looking at it differently.

Can management see the stock properly?

Are people actually entering information into the ERP?

When management asks for a report, does it come from the system?

Can the ERP support important operational decisions such as container planning?

Is the organization becoming less dependent on scattered Excel sheets and handwritten records?

Those questions matter more to me now than whether a feature technically exists.

A system can have 500 features and still fail inside a company.

A much simpler system can create real value if people trust it and actually use it every day.

## If I had to implement another manufacturing ERP tomorrow

I would spend even more time thinking about people before thinking about features.

I would ask early:

Who is actually going to enter this data?

How busy is that person?

What are they doing today instead?

What happens if they don’t enter it?

Who is going to check?

Will management actually use the resulting information?

And most importantly:

Will management refuse to accept a parallel version of the truth?

Because that is where I think many ERP projects quietly fail.

The ERP goes live.

But Excel also stays alive.

The register stays alive.

WhatsApp stays alive.

And eventually there are four versions of the same information.

At Tirupati Forge, management asking for reports through ERP helped break that pattern.

That lesson will stay with me.

## What I took away from Tirupati Forge

The project took around four months and involved roughly 20 ERP users.

We implemented ERP and CRM, worked through actual manufacturing workflows, improved stock visibility and built a custom container-planning workflow around sales orders, available stock and WIP.

But the most valuable outcome for me personally wasn’t a particular module.

It was understanding what ERP implementation really looks like inside a manufacturing MSME.

It is messy.

Plans change.

People are busy.

Manpower is limited.

Users resist new systems.

Processes don’t always fit the software.

And sometimes the most important intervention isn’t technical at all.

It can be the owner simply saying:

“Show me the report in ERP.”

That one sentence can do more for adoption than another week of training.

We are still learning from implementations like Tirupati Forge as we build i.e. tech.

And I think that is exactly how manufacturing software should be built.

Not only from feature lists and conference rooms.

But from seeing what actually happens when software meets a running factory.

---

*Originally published on Medium: [read the original article](https://medium.com/@ceojayraj/four-months-inside-a-forging-company-changed-how-i-think-about-erp-0417aa8893c6).*
