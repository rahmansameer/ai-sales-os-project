# AI Sales Operations System

An open-source AI-powered sales operations and CRM automation system built with Next.js, Supabase, n8n, OpenAI, and Gmail.

This project helps automate:

- Lead capture
- AI lead qualification
- AI proposal generation
- Proposal approval workflow
- Proposal email sending
- Follow-up automation
- CRM management
- Activity timeline tracking
- Sales pipeline analytics

The goal of this project is to show how modern AI automation systems can be built using free and accessible tools.

Everything in this project is fully open source.

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- SWR
- Framer Motion
- Recharts

### Backend / Database

- Supabase

### Automation

- n8n

### AI

- OpenAI API

### Email

- Gmail

## Features

### AI Lead Qualification

When a new lead enters the system:

- AI analyzes the lead
- Detects urgency
- Detects buyer intent
- Detects project size
- Detects lead quality
- Generates reasoning

### AI Proposal Generation

The system automatically generates AI-powered proposal drafts based on lead information.

### Human Approval Workflow

Every proposal can be reviewed manually before sending.

### Automated Proposal Sending

Once approved:

- Gmail automatically sends the proposal
- Proposal status updates automatically
- Activity logs are created

### CRM Dashboard

The dashboard includes:

- Lead list
- Search and filtering
- Proposal status tracking
- AI analysis view
- Proposal preview
- Activity timeline
- Pipeline analytics
- Charts and metrics

### Activity Timeline

Every important event is logged:

- Lead created
- Proposal generated
- Proposal approved
- Proposal sent
- Future follow-up actions

### Analytics Dashboard

Includes:

- Total leads
- Approved proposals
- Sent proposals
- Closed deals
- High quality leads
- Sales pipeline overview
- Proposal analytics charts

## System Architecture

The architecture looks like this:

```text
Next.js Dashboard
        ↓
API Routes / Webhooks
        ↓
n8n Workflows
        ↓
Supabase Database
        ↓
AI / Gmail / External APIs
```

The dashboard is mainly the UI.

n8n acts as the automation engine.

Supabase stores all application data.

## Project Structure

```text
app/
components/
lib/

n8n-workflows/
  lead-capture-system.json
  approved-proposal-sender.json
  lead-followup-system.json
  error-handler.json
```

## Requirements

Before running the project you need:

- Node.js
- npm
- Supabase account
- OpenAI API key
- Gmail account
- n8n installed locally

## Installation

## 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

```bash
cd YOUR_PROJECT_NAME
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment Variables

Create a `.env.local` file.

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

You can get the Supabase values from:

Supabase → Project Settings → API

## 4. Run Frontend

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

## Supabase Setup

## Create Tables

Create a `leads` table.

Required columns:

```text
id
name
email
company
message
status
lead_score
proposal_status
created_at
lead_quality
urgency
buyer_intent
project_size
ai_reason
proposal_text
```

Create a `lead_activities` table.

```sql
create table lead_activities (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete cascade,
  activity_type text,
  activity_text text,
  created_at timestamptz default now()
);
```

## Enable Row Level Security

```sql
alter table lead_activities enable row level security;
```

## Permissions

```sql
grant all on table lead_activities to anon;
grant all on table lead_activities to authenticated;
grant all on table lead_activities to service_role;
```

## Policy

```sql
create policy "public insert lead activities"
on lead_activities
for insert
to anon
with check (true);
```

## n8n Setup

## Install n8n

```bash
npm install n8n -g
```

Run:

```bash
n8n
```

n8n will run at:

```text
http://localhost:5678
```

## Import Workflows

Inside the repository there is an:

```text
n8n-workflows/
```

folder.

Import all workflow JSON files into n8n.

### How To Import

Inside n8n:

- Open Workflows
- Click Import
- Select JSON workflow file

Import all workflows.

## Configure Credentials

Inside n8n connect:

- Supabase
- Gmail
- OpenAI

## Main Workflows

### Lead Capture System

Responsible for:

- Receiving lead webhooks
- AI qualification
- AI proposal generation
- Saving lead data
- Creating activities

### Approved Proposal Sender

Responsible for:

- Receiving approval webhook
- Fetching lead
- Sending Gmail proposal
- Updating proposal status

### Lead Follow Up System

Responsible for:

- Follow-up automation
- Future lead nurturing

### Error Handler

Responsible for:

- Error monitoring
- Workflow failure handling

## Dashboard Features

## Lead Management

You can:

- View leads
- Approve proposals
- Delete leads
- View AI analysis
- View AI proposals
- Track activities

## Proposal Lifecycle

Proposal states:

```text
Draft
Approved
Sent
Closed
```

## Analytics

Includes:

- Total leads
- Proposal analytics
- Pipeline overview
- High quality lead count
- Charts

## Activity Timeline

Every lead has activity history.

Examples:

```text
Lead Created
Proposal Generated
Proposal Approved
Proposal Sent
```

## Running Full System

## Step 1

Run Next.js:

```bash
npm run dev
```

## Step 2

Run n8n:

```bash
n8n
```

## Step 3

Make sure:

- Supabase is connected
- Gmail credentials work
- OpenAI API key is added

## Step 4

Submit leads.

The automation system should now:

- Capture leads
- Analyze with AI
- Generate proposal
- Store in database
- Show in dashboard
- Allow approval
- Send proposals
- Track activities

## Open Source

This project is fully free and open source.

You can:

- modify it
- improve it
- use it for learning
- use it for freelancing
- use it for agency work
- build SaaS products from it

## Future Improvements

Possible future upgrades:

- AI-generated follow-up emails
- AI memory system
- Telegram notifications
- Slack integration
- Team collaboration
- Revenue tracking
- Advanced analytics
- AI sales assistant
- Multi-user support
- Production deployment

## Learning Goals

This project is designed to help developers learn:

- AI automation systems
- CRM architecture
- Business workflows
- API integration
- Workflow automation
- Event-driven systems
- AI product development
- Dashboard engineering
- Automation architecture

## Credits

Built using:

- Next.js
- Supabase
- n8n
- OpenAI
- Gmail
- Tailwind CSS
- Recharts
