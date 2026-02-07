# Data Model: Landing Page with Try Demo

**Feature**: 003-landing-page
**Date**: 2026-02-06

## Overview

The landing page is a static marketing page with no dynamic data or API calls. All content is translatable text and static assets. No new database entities, API endpoints, or state management are required.

## Entities

### Feature Card (Display Only)

Represents a feature highlight card in the features section. Defined as a static constant array, not fetched from an API.

| Field    | Type       | Description                              |
| -------- | ---------- | ---------------------------------------- |
| id       | string     | Unique identifier (used as React key)    |
| titleKey | string     | i18n translation key for the card title  |
| descKey  | string     | i18n translation key for the description |
| icon     | LucideIcon | Lucide icon component reference          |

### Landing Page Content (i18n)

All visible text is stored in the `Landing` namespace within `messages/{locale}.json`. No runtime data fetching.

| Key                   | Type   | Description                     |
| --------------------- | ------ | ------------------------------- |
| tryDemo               | string | CTA button text                 |
| noLoginRequired       | string | Helper text below CTA           |
| socialProof           | string | Social proof pill (ICU format)  |
| heroTitle1            | string | First line of headline          |
| heroTitle2            | string | Second line of headline (amber) |
| heroSubtitle          | string | Subheadline paragraph           |
| featureReleaseTitle   | string | Feature card 1 title            |
| featureReleaseDesc    | string | Feature card 1 description      |
| featurePaidTitle      | string | Feature card 2 title            |
| featurePaidDesc       | string | Feature card 2 description      |
| featureChartsTitle    | string | Feature card 3 title            |
| featureChartsDesc     | string | Feature card 3 description      |
| featureCommunityTitle | string | Feature card 4 title            |
| featureCommunityDesc  | string | Feature card 4 description      |
| footerText            | string | Footer attribution text         |

## State Management

None required. The landing page is stateless and server-rendered.

## Assets

| Asset           | Location                    | Description                            |
| --------------- | --------------------------- | -------------------------------------- |
| Hero background | `public/images/hero-bg.jpg` | Dark atmospheric musician/artist photo |
