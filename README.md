# 🌐 Attendance Automation Web App

This repository contains the source code for **Attendance Automation System** hosted on Netlify 👉 [Live Demo](https://peaceful-sfogliatella-32ac18.netlify.app/).  

The project demonstrates an **automated attendance system** powered by **geo-fencing and a drop box categorization model** that classifies students into **Present**, **Late**, and **Absent** categories.  

---

## 🚀 Features

- **Role-based Login System**  
  - 👨‍🎓 **Students** – login with register number & DOB, can only view their own attendance.  
  - 👩‍🏫 **Teachers** – login with name & common password `4455@asdf`, can start/end sessions, manage drop boxes, and finalize attendance.  
  - 🏛️ **Admins** – login with name & predefined password, can view analytics and percentages but cannot modify attendance.  

- **Drop Box Categorization**
  - **Outside Zone** (default) → students start here before class.  
  - **Present** → students who arrive inside the geofenced boundary before cutoff time.  
  - **Latecomer** → students who arrive after cutoff.  
  - At session end → all students in Outside Zone are marked **Absent**.  

- **Geo-fencing Integration**  
  - Uses location services to detect whether students are inside/outside the classroom boundary.  

- **Reports & Notifications**  
  - Automated reports generated in PDF/Excel format.  
  - Notifications for absences, late arrivals, and shortage of attendance.  

---

## 🛠️ Tech Stack

- **Frontend:** React.js (hosted on Netlify)  
- **Backend (planned):** Node.js / Django / Flask REST APIs  
- **Database:** MySQL / MongoDB with role-based access control  
- **Geo-fencing:** Google Maps API / Mapbox API  
- **Authentication:** JWT-based role management  

---

## 🔄 Workflow

1. Teacher logs in and starts predefined session → Drop boxes created.  
2. Students log in → Geo-location checked → Automatically moved into respective drop box.  
3. Teacher monitors drop boxes live during class.  
4. At class end → Attendance finalized as **Present / Late / Absent**.  
5. Students → Can only view their status & history.  
6. Admin → Can view analytics & percentages.  
7. Reports + Notifications → Auto generated.  

---

## 📂 Repository Structure

