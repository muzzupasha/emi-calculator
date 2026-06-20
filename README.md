# EMI & Loan Calculator

A clean, professional, and production-quality client-side **EMI (Equated Monthly Installment) & Loan Calculator** built using **Next.js (App Router)** and **Tailwind CSS**.

🔗 **Live Link**: [https://emi-calculator-ruby-five.vercel.app/](https://emi-calculator-ruby-five.vercel.app/)

---

## 🌟 Key Features

* ⚡ **Live React Calculations**: Instantly computes and updates outputs as you adjust values (no submit button or loading screens).
* 🎛️ **Dual Interactive Inputs**: Synchronized range sliders and direct numeric text fields for:
  * **Loan Amount (₹)**: From ₹10,000 up to ₹10 Crore, including live helper text converting figures into Indian number words (Thousands, Lakhs, and Crores).
  * **Interest Rate (%)**: From 1% to 30% per annum.
  * **Loan Tenure**: Separated into Years (0 to 30) and Months (0 to 11) for flexible terms.
* 📊 **Principal vs. Interest Ratio**: A clean, horizontal, stacked segmented bar showing the proportional ratio of the principal loan amount vs. the total interest payable.
* 📅 **Collapsible Amortization Table**: A complete month-wise breakdown (Month Number, EMI, Principal Component, Interest Component, Remaining Balance) with sticky headers and responsive layout.
* 🎨 **Premium Visual Design**:
  * Page background in **Dark Navy** (`#0F1729`).
  * Interactive surface in **Warm Off-White** (`#FAF7F2`).
  * Principal accent color in **Green** (`#1A7F5A`) and Interest in **Amber** (`#D97706`).
  * Elegant fonts: `Inter` for UI text and `JetBrains Mono` for monospace numbers and tables.
  * Fully accessible with visible focus rings, native input tags, and keyboard support.

---

## 📐 Mathematical Formulation

The monthly installment is computed using the standard financial formula:

$$EMI = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$

Where:
* **$P$** = Principal Loan Amount
* **$r$** = Monthly Interest Rate = $\frac{\text{Annual Interest Rate}}{12 \times 100}$
* **$n$** = Total number of monthly installments = $(\text{Years} \times 12) + \text{Months}$

### Edge Case Adjustments:
1. **$0\%$ Interest Rate**: Enforces $EMI = P / n$ to prevent division by zero.
2. **$0$ Months Tenure**: Returns $0$ values and shows a visual validation alert asking for active terms.
3. **Rounding Correction**: The final month's principal component is adjusted to ensure the final remaining balance evaluates exactly to $0$.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Library**: [React](https://react.js.org/) (useState, useMemo)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Fonts**: `Inter`, `JetBrains_Mono` loaded via `next/font/google`
* **Hosting**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To run the project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/muzzupasha/emi-calculator.git
cd emi-calculator/my-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create a production build
```bash
npm run build
npm run start
```

---

## 🎖️ Credits & Developer

* Built for **[Digital Heroes Co.](https://digitalheroesco.com)**
* **Developer**: Muzahir Ali
* **Email**: [muzahirraza509@gmail.com](mailto:muzahirraza509@gmail.com)
