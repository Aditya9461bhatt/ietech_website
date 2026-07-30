---
title: From Heat Receipt to Container Readiness
date: July 26, 2026
client: tirupati forge
industry: forge
shortDescription: How Tirupati Forge connected stage-wise stock, heat traceability and export packing in i.e. ERP
authorName: IETECH Technical Team
authorEmail: ceojayraj@ietech.ai
image: ""
status: draft
dateISO: "2026-07-25T18:30:00.000Z"
---

## How Tirupati Forge connected stage-wise stock, heat traceability and export packing in i.e. ERP

**Customer:** Tirupati Forge Limited  
**Industry:** Forged flanges, forged components and automotive components  
**Case focus:** Stock visibility, heat traceability, partial production transfer and container planning  
**Solution:** i.e. ERP manufacturing and dispatch controls  
**Status:** Draft for customer review  

> A heat does not move through a forging plant as one neat line. It is received, cut, forged, held, reworked, machined, inspected and packed, often in partial quantities.

This case study combines the client-provided implementation brief with representative records created in the local i.e. ERP demonstration environment. Screenshot figures are illustrative and are not audited production totals.

---

## Executive Summary

Tirupati Forge Limited needed a dependable answer to a basic production question: **where is the material now, and how much of it is genuinely ready for the next step?**

The answer was difficult because stock did not exist in one simple state. The same heat could be present as raw material, cutting WIP, forged output, quality-hold stock, semi-finished stock, finished goods or packed material. Production also moved in partial quantities. A Job Card might process 100 pieces, transfer 50 pieces downstream and remain open for the rest.

At the other end of the process, export dispatch planning had its own calculations. The packing team needed pieces per box, box dimensions, tare weight, gross weight and destination limits. When these figures were maintained outside the production and stock flow, planners could prepare a container plan that did not match what was actually ready to ship.

The i.e. ERP implementation connected these control points:

- Incoming material is recorded with its heat or batch reference.
- Quality Inspection remains linked to the receipt, item and heat.
- BOM and Work Order operations define the intended warehouse path.
- Job Cards record the quantity taken, good output and exception quantities.
- Partial transfers make only the transferred good quantity available downstream.
- Container planning applies maintained packing rules to shipment quantities.

The result is not simply another dashboard. It is a clearer operating record from receipt to dispatch planning.

---

## Customer Context

Tirupati Forge Limited manufactures forged flanges and components through a sequence that includes material receipt, cutting, heating, forging, machining, inspection and packing. The supplied reference brief describes a Rajkot-based manufacturer and exporter serving the U.S., European and African markets, with an installed capacity of 15,000 tonnes per year.

The implementation brief records the following scope:

| Area                    | Implementation context                                       |
| ----------------------- | ------------------------------------------------------------ |
| ERP users               | 20 users                                                     |
| Implementation duration | Four months                                                  |
| Core scope              | ERP, CRM and HRMS                                            |
| Manufacturing controls  | Work Orders, Job Cards, operation warehouses and stage-wise stock |
| Traceability            | Heat and batch references across receipt, quality and production |
| Custom controls         | Gate entry and container planning                            |
| Main requirement        | Exact stock and status at every manufacturing stage          |

### Why Heat Traceability Is a Market Requirement

For forged flange and component customers, the heat number is the thread between incoming material certification and the finished product. Material may arrive in several receipts against one Purchase Order. The same heat may then be divided across machines, shifts, rework, quality hold and multiple partial transfers.

That creates a practical rule for the ERP:

> **Quantity can split across stages; the heat identity must not.**

Capturing the heat number only on the first receipt is not enough. The reference must remain available when quality is checked, when material is loaded into an operation, when partial output moves downstream and when the finished item is prepared for dispatch.

---

## Operational Pain Points

### 1. Stock Was Visible as a Total, Not Always as a Usable Balance

Raw material, WIP, semi-finished goods, quality stock, packing stock and dispatch-ready stock existed in different physical and administrative stages. Management could know the total quantity while still being unsure how much was available at a specific operation.

The missing distinction was between:

- physical quantity in a warehouse;
- quantity linked to the correct heat;
- quantity already consumed by an operation;
- good output produced but not transferred;
- quantity released to the next operation;
- quantity held, rejected or sent for rework.

### 2. Partial Production Needed a Repeatable Method

A Job Card could not be treated as an all-or-nothing event. Operators needed to process and transfer material in parts while leaving the card open for the remaining planned quantity.

Without a controlled balance, the same batch line could be transferred twice, or a downstream operation could start against ambient warehouse stock that did not come from the expected upstream operation.

### 3. Heat and Quality Records Could Become Separated

The same heat could arrive in more than one receipt and require separate quality inspections. Manual hand-offs increased the risk that a quality result was linked to a document but not easily followed into the production balance.

### 4. Hold, Rework and Rejection Needed Their Own Meaning

Production exceptions were real stock states, not notes. A quantity held on a production manager's instruction had to be distinguished from rework material and final rejection. Combining these quantities into one completion figure made WIP difficult to explain.

### 5. Container Planning Depended on Manual Box Arithmetic

Export planning required more than total product weight. The packing team had to account for:

- pieces per box;
- box dimensions;
- number of boxes;
- tare weight per box;
- total net and gross weight;
- destination-specific weight and box limits.

When this calculation was performed in a separate spreadsheet, any change in order quantity or packing rule required manual revision.

### 6. Managers Relied on Follow-Up Calls

Stores, production, quality and packing each held part of the answer. Planners often had to ask several people what was ready, what was blocked and what could be dispatched.

---

## The Connected Operating Model

### Step 1: Receive and Identify the Material

Gate Entry and Purchase Receipt establish the supplier, reference document, item, received quantity and heat or batch reference. If one Purchase Order arrives in several vehicles or lots, each receipt can be recorded separately while retaining the same supplier heat number.

### Step 2: Inspect the Receipt

Quality Inspection records the accepted or rejected result against the receipt line and heat reference. Separate receipts can therefore have separate inspections even when the supplier heat number is the same.

![Incoming Quality Inspection with heat reference](screenshots/quality_inspection_heat.png)

*Figure 1. A submitted incoming Quality Inspection linked to Purchase Receipt PR-26-00009, item ASTM A105 and heat TF-20260428-A156. This is a representative local record.*

The control is useful because stores and quality are looking at the same material identity before production begins.

### Step 3: Route Material by Operation

BOM and Work Order defaults define the intended source, WIP and finished-stage warehouses. The planner can still override a default when the production route requires it, but the normal warehouse path does not need to be entered again for every Work Order.

### Step 4: Process Material in Partial Lots

The Job Card remains open while planned quantity is still pending. Its batch lines record the material taken into the operation and the output produced from that run.

![Operation-level Job Card progress](screenshots/job_card_top.png)

*Figure 2. Forging Job Card PO-JOB00049 for a 200-piece operation, showing 100 pieces completed while the card remains Work In Progress.*

### Step 5: Transfer Only Completed Good Output

The operator transfers the selected good quantity to the next process. The transferred balance increases downstream availability; the untransferred balance remains on the current Job Card.

![Job Card partial-transfer batch balance](screenshots/job_card_batch_balance.png)

*Figure 3. Heat 97234 loaded with 100 units, 100 units recorded as good output and 50 units transferred downstream. This is a representative local record.*

The working balance is straightforward:

```text
Good output - quantity already transferred = remaining quantity available to transfer
```

This prevents the warehouse balance from becoming the business source of truth for a later operation. Physical stock is still validated, but downstream consumption is limited by the system-created upstream transfer.

### Step 6: Record Hold, Rework and Rejection Separately

Good output, held stock, rework and rejection do not have the same operational meaning. Each quantity should carry its reason and destination warehouse so that production and quality can see why it is unavailable.

### Step 7: Plan Export Packing

The container plan converts shipment quantities into boxes using maintained packing rules. It then checks tare and gross weight against the selected destination and container limits.

---

## Container Planning in Practice

For the case-study demonstration, one Houston shipment was created with four flange items and a 40 ft standard container. The maintained packing rules produced the following plan:

| Planning measure               | Demonstration result |
| ------------------------------ | -------------------: |
| Shipment quantity              |         1,488 pieces |
| Planned boxes                  |                   23 |
| Net product weight             |          20,721.6 kg |
| Total tare weight              |           1,035.0 kg |
| Planned gross weight           |          21,756.6 kg |
| Destination gross-weight limit |          23,000.0 kg |
| Planned containers             |                    1 |

![Container plan summary](screenshots/container_plan_summary.png)

*Figure 4. Container Load Plan CLP-2026-00015 for shipment batch NFC-HOU-0826-A. The figures are an illustrative planning run created from local packing rules.*

The planned item section retains the shipment quantity, packaging type, box references and physical box dimensions. The box/tare section then expands the plan crate by crate.

![Container planned items and box/tare rows](screenshots/container_plan_items.png)

*Figure 5. Planned items with box numbers and dimensions, followed by the detailed box/tare summary.*

This gives the packing team a plan that can be checked before the material reaches the loading area. If an order quantity or packing rule changes, the load can be recalculated instead of manually rebuilt.

---

## Before and After

| Operating point     | Earlier working method                                       | Control introduced in i.e. ERP                               |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Incoming material   | Receipt and inspection were checked separately.              | Receipt, item and heat reference remain linked to Quality Inspection. |
| Stage-wise stock    | Total stock was easier to find than usable stock at an operation. | Warehouses and operation transfers distinguish raw material, WIP, held stock, SFG and finished stock. |
| Production hand-off | Completion was often discussed as one total.                 | Only transferred good quantity becomes available downstream. |
| Partial production  | Remaining balance required manual follow-up.                 | The Job Card stays open and retains the unprocessed or untransferred balance. |
| WIP exceptions      | Hold and rework needed explanation outside the stock figure. | Hold, rework and rejection carry their own quantity, reason and destination. |
| Export packing      | Boxes and weights were calculated outside the production flow. | Packing rules calculate box count, dimensions, tare and gross weight. |

---

## Operational Outcome

The value of the implementation is fewer uncertain hand-offs.

### Traceability

Receipt, inspection and production records can be followed by heat or batch rather than reconstructed after the event.

### Stage-Wise Stock Visibility

Planners can distinguish raw material, operation WIP, held stock, semi-finished output, finished goods and packing stock by process state and warehouse.

### Controlled Partial Transfer

A downstream operation sees only what the upstream operation has actually transferred. The previous Job Card remains available for the unprocessed balance.

### Exception Visibility

Rework, rejection and hold quantities can be recorded with reasons instead of being absorbed into an unexplained variance.

### Dispatch Readiness

Container planners can review box count, dimensions, tare and gross weight before loading begins.

---

## What Should Be Measured Next

The implementation should be evaluated through operating behaviour, not by the number of screens delivered. Three measures are especially useful:

1. Time spent reconciling stage-wise stock before production or dispatch decisions.
2. Percentage of Job Card partial transfers completed without correction or duplicate movement.
3. Variance between planned and actual container box count, tare and gross weight.

These measures will show whether the control flow is being followed consistently and where training or validation still needs improvement.

---

## Case Summary

Tirupati Forge moved from separate records of stock, production, quality and packing toward one traceable operating flow built around the material heat and its physical movement.

The implementation connects five questions that matter on the shop floor:

- What material was received?
- Which heat did it come from?
- Which operation currently controls it?
- How much is good, held, rework, rejected or transferred?
- Is the finished quantity genuinely ready to pack and dispatch?

When those questions use the same record chain, management spends less time assembling the story and more time acting on it.

---

## Sources and Disclosure

- Company profile, user count, implementation duration, scope and market context are taken from the client-provided reference document `tirupati_forge_ieerp_case_study.docx`, which cites Tirupati Forge's official website.
- Operational interpretation is based on the local i.e. ERP configuration and records reviewed on 26 July 2026.
- Screenshots contain representative local demonstration data and are not audited production results.
- This draft does not claim financial ROI or include a customer testimonial. Those should be added only after client validation.

**Prepared by i.e. tech | i.e. ERP | www.ietech.ai**
