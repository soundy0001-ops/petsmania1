# PetHouse BBA - Professional Pet Supplies E-Commerce Store

A modern, multilingual pet supplies e-commerce platform built with Next.js, React, Tailwind CSS, and Supabase.

## Features

### Multilingual Support
- English, French, and Arabic language support
- Easy language switching with persistent user preference
- Fully translated UI and content

### Product Management
- Browse products by category (Cats, Dogs, Birds, Other)
- Advanced search and filtering
- Sort by price and newest products
- Product details with descriptions and pricing
- Real-time stock availability

### Shopping Experience
- Add products to cart
- View and manage cart items
- Adjust quantities
- Coupon code support
- Secure checkout process
- Order confirmation

### Admin Dashboard
- Password-protected admin panel
- Product management (Add, Edit, Delete)
- Order tracking and status updates
- Inventory management
- Multilingual product descriptions

### Design Features
- Modern, cute, and professional design
- Soft pastel color scheme (Purple, Blue, Pink)
- Dark mode support
- Smooth animations and transitions
- Fully responsive design
- Mobile-first approach

### Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Simple password-based admin auth

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Run the database initialization script in Supabase SQL editor:
   - Execute the SQL from `scripts/01-init-database.sql`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Navigate to `/admin`
- Default password: `admin123`
- Change this in production!

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Homepage
│   ├── shop/page.tsx         # Shop/Products page
│   ├── cart/page.tsx         # Shopping cart
│   ├── checkout/page.tsx     # Checkout page
│   ├── admin/page.tsx        # Admin dashboard
│   ├── about/page.tsx        # About page
│   ├── contact/page.tsx      # Contact page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── header.tsx            # Navigation header
│   ├── footer.tsx            # Footer
│   ├── language-switcher.tsx # Language selector
│   └── theme-provider.tsx    # Theme management
├── lib/
│   ├── i18n.ts              # Internationalization
│   ├── supabase-client.ts   # Client-side Supabase
│   └── supabase-server.ts   # Server-side Supabase
└── scripts/
    └── 01-init-database.sql # Database schema
\`\`\`

## Customization

### Colors
Edit the CSS variables in `app/globals.css` to customize the color scheme.

### Translations
Update the translations object in `lib/i18n.ts` to add or modify translations.

### Admin Password
Change the password check in `app/admin/page.tsx` (line with `password === "admin123"`).

## Deployment

The project can be deployed to any hosting platform that supports Next.js applications.

## نشر إلى Vercel (خطوات سريعة)

1. اربط المستودع الموجود على GitHub (أو GitLab/Bitbucket) إلى حسابك على Vercel: "New Project" → Import Git Repository.
2. أثناء الإعداد في Vercel اضبط:
   - Install Command: `pnpm install` (أو `npm install` إذا لا تستخدم pnpm)
   - Build Command: `pnpm build` (أو `npm run build`)
   - Output Directory: اتركه فارغاً (Next.js يتم اكتشافه تلقائياً)
3. أضف متغيرات البيئة في Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (قيمة Supabase URL الخاص بك)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (public anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (service role key — ضعها فقط في بيئات السيرفر، ولا تكشفها للعميل)
   - `ADMIN_PASSWORD` = (كلمة مرور المشرف الوحيدة والمخزنة على الخادم — ضعها كمتغير Server-only في Vercel)

   ملاحظة: أي متغير يبدأ بـ `NEXT_PUBLIC_` سيصبح متاحًا في الكود المتجه للعميل. لا تضع `ADMIN_PASSWORD` كبادئة `NEXT_PUBLIC_`.

   ملاحظة: أي متغير يبدأ بـ `NEXT_PUBLIC_` سيصبح متاحًا في الكود المتجه للعميل.

4. Deploy: بعد إعداد المتغيرات اضغط Deploy وراقب سجلات البناء (Build Logs).

ملاحظات أمان:
- تجنّب وضع `SUPABASE_SERVICE_ROLE_KEY` في كود العميل. احتفظ به فقط كمتغير بيئة في Vercel واستخدمه على الخادم (API routes أو server-side functions).
- تنفيذ التحقق من صلاحية المشرف (admin) على الخادم هو الأفضل؛ حالياً الصفحة تستخدم `NEXT_PUBLIC_ADMIN_PASSWORD` وهي مرئية في العميل.

إذا أردت، أستطيع:
- إنشاء ملف `.env.example` (قمتُ بإضافته) و
- تعديل صفحة `app/admin/page.tsx` لكي تعتمد على تحقق من جهة الخادم بدلاً من التحقق في العميل—وأعطيك تعليمات الخطوة-بخطوة لذلك.

## License

MIT License - feel free to use this project for your own pet store!

## Support

For issues or questions, please contact info@pethouse.com
