# 🌿 Rotary Club of Gudalur Garden City

<div align="center">

![Rotary International](https://img.shields.io/badge/Rotary-International-FFB81C?style=for-the-badge&logo=rotary-international&logoColor=white)
![RI District 3000](https://img.shields.io/badge/RI_District-3000-00205B?style=for-the-badge)
![Club ID](https://img.shields.io/badge/Club_ID-88574-047857?style=for-the-badge)

<img src="https://readme-typing-svg.demolab.com?font=Montserrat&weight=700&size=28&pause=1000&color=047857&center=true&vCenter=true&width=600&lines=Service+Above+Self;Uniting+Leaders%2C+Building+Friendships;Creating+Lasting+Change" alt="Typing SVG" />

**Official Website for Rotary Club of Gudalur Garden City**  
*Chartered on July 1, 2017*

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-Visit_Now-047857?style=for-the-badge)](https://rotaryclubgudalur.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🎯 About This Project

This is the **official website** for the **Rotary Club of Gudalur Garden City**, a community of service-minded individuals dedicated to creating positive change in the Gudalur region of Tamil Nadu, India.

<div align="center">

| 🏆 **25+ Active Members** | ⭐ **8+ Years of Service** | 🌍 **Part of RI District 3000** |
|:---:|:---:|:---:|

</div>

### 🌟 Our Avenues of Service

<table>
<tr>
<td align="center">💉<br><b>Ending Polio</b></td>
<td align="center">🕊️<br><b>Promoting Peace</b></td>
<td align="center">🏥<br><b>Fighting Disease</b></td>
</tr>
<tr>
<td align="center">📚<br><b>Supporting Education</b></td>
<td align="center">👶<br><b>Saving Mothers & Children</b></td>
<td align="center">🌱<br><b>Protecting Environment</b></td>
</tr>
</table>

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🏠 **Hero Section** | Dynamic hero with auto-scrolling events & community stats |
| 👥 **Board Members** | Auto-scrolling carousel showcasing club leadership |
| 📅 **Events** | Interactive event cards backed by Convex |
| 🖼️ **Gallery** | Beautiful image gallery with lightbox popup |
| 📞 **Contact Form** | Direct contact saved to Convex |
| 📖 **Daily Thirukural** | Tamil wisdom - fetched daily from API |
| 📱 **Fully Responsive** | Optimized for mobile, tablet & desktop |

</div>

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-EE342F?style=flat-square&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/peterish8/rc-gudalur.git

# Navigate to project
cd rc-gudalur

# Install dependencies
pnpm install

# Set up environment variables
npx convex dev   # logs in, links the Convex project, writes .env.local
# (keep `npx convex dev` running in a second terminal while developing)

# Run development server
pnpm dev
```

Visit `http://localhost:3005` to see the website!

---

## 📁 Project Structure

```
rc-gudalur/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── header.tsx          # Navigation header
│   ├── hero-section.tsx    # Hero + Upcoming events
│   ├── board-members.tsx   # Board members carousel
│   ├── events-section.tsx  # Events showcase
│   ├── gallery-section.tsx # Photo gallery
│   ├── contact-section.tsx # Contact form + Thirukural
│   └── footer.tsx          # Footer
├── lib/
│   ├── convex.ts           # Convex client
│   ├── load-with-fallback.ts # Convex read + sample-content fallback
│   └── mock-data.ts        # Sample content shown when Convex is empty/unreachable
├── convex/                 # Convex schema + functions (shared with the admin panel)
├── scripts/seed-convex.mts # Seeds an empty deployment with the sample content
└── public/                 # Static assets
```

---

## 🌐 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
```

---

## 📱 Responsive Design

<div align="center">

| Device | Breakpoint | Features |
|--------|------------|----------|
| 📱 Mobile | < 640px | Touch-optimized, compact layout |
| 📒 Tablet | 768px - 1024px | 5-column grid, wider events panel |
| 💻 Desktop | > 1024px | Full layout with all features |

</div>

---

## 🤝 Contributing

This project is maintained by **PTC** (Prathish Technology Consulting).

For any inquiries or suggestions:
- 📧 Contact via the website form
- 🌐 Visit [Rotary International](https://rotary.org)

---

## 📜 License

This project is proprietary software for the Rotary Club of Gudalur Garden City.

---

<div align="center">

### 🔄 *Service Above Self*

<img src="https://readme-typing-svg.demolab.com?font=Montserrat&weight=600&size=18&pause=1000&color=047857&center=true&vCenter=true&width=500&lines=Part+of+Rotary+International;Creating+Positive+Change+Since+2017;Together%2C+We+Make+a+Difference!" alt="Typing SVG" />

**Made with ❤️ by PTC**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=peterish8.rc-gudalur&left_color=gray&right_color=047857)

</div>
