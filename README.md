# 🌍 Travel Management Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

## 🚀 Overview

This Travel Management System allows administrators to manage destinations, travel packages, itineraries, and more. Designed to offer a rich and interactive travel planning experience.

---

## 🏗️ Core Entities

### 1. 🌐 Country (`Pays`)
- Visa requirements
- Local time & currency
- Spoken languages
- Flight duration
- Vaccination requirements
- Monthly travel season rating (1–3 scale)

### 2. 🧳 Offer (`Offre`)
- Destination details
- Country, themes & badges
- Pricing, duration & coordinates
- Image gallery

### 3. 📅 Planning
- Linked to an offer
- Day-by-day schedule

### 4. 🗓️ Program (`Programme`)
- Connected to planning
- Activity timeline

### 5. 🖼️ Photos
- Associated with:
  - Countries
  - Planning
  - Programs

---

## 🔗 Entity Relationships

### 🧾 Offer Management Flow
1. Create base offer
2. Assign to a country
3. Add themes (optional)
4. Add badges (optional)

### 🛫 Planning Workflow
1. Create planning instance
2. Link to offer
3. Add program
4. Add photos

---

## 👥 User Roles

### 👨‍💼 Administrator
- Full access (CRUD)
- Manage badges, themes, users

### 🙋 Regular User
- View-only access for offers and countries
- No admin privileges

---

## 🧩 Key Features

### 🇺🇳 Country Management
- Detailed country profiles
- Travel requirement tracking
- Monthly travel indicators

### 🎁 Offer Management
- Dynamic pricing
- Theme & badge tagging
- Image management

### 📍 Planning System
- Program setup
- Activity schedule
- Photo attachments

---

## 🛠️ Technical Implementation

### ✅ Validations
- Required fields
- Data type checks
- Entity relationship enforcement

### 🖼️ Image Handling
- Multi-format support
- Preview & optimized storage

### 🔍 Search & Filtering
- By country, theme, badge
- Dynamic UI filtering

---

## 📝 Adding New Items (Best Practices)

1. **Badges**: Create & assign for offer highlights  
2. **Themes**: Set up for categorization  
3. **Country**: Add profile, set travel rules  
4. **Offers**: Link to country, add tags, images  
5. **Planning & Program**: Build itinerary, upload media  

---

## ⚠️ Error Handling

- Form validation feedback
- Clear API error messages
- Loading indicators and retry logic

---

## 📚 Additional Resources

- [API Documentation (Coming Soon)]()
- [UI/UX Design Guidelines (Figma Link)]()
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 📩 Contact

For feature requests or support: **hafidnid909@gmail.com**

---

> ✨ *This README provides a high-level overview. For full documentation, please refer to the Wiki or contact the dev team.*
