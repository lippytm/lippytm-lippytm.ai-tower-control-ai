# Service Application Relationship Model

## Purpose
This document defines how services, products, applications, repositories, platforms, and business-growth surfaces relate to one another across the lippytm ecosystem.

## Core Goal
Make Business of Businesses growth relationships explicit so manufactured services and applications can be reused, scaled, and tracked consistently.

## Suggested Relationship Types
- service_supports_application
- product_enables_service
- repo_enables_service
- platform_delivers_application
- application_generates_growth_surface
- educational_asset_strengthens_service
- media_asset_supports_application
- reporting_asset_measures_service

## Suggested Relationship Fields
- relationship ID
- source object ID
- source object type
- relationship type
- target object ID
- target object type
- priority
- review level
- notes

## Best Practices
- make growth relationships explicit instead of implied
- connect services and applications back to real repo and platform assets
- preserve review level and maturity context around relationships
- reuse the same relationship model across business, education, media, and reporting surfaces

## Future Extensions
- service-to-application register template
- growth relationship dashboard
- reuse relationship scorecard
