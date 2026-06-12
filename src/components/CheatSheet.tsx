import React from 'react';
import { InlineMath } from 'react-katex';

const cheatsheetData = [
  {
    category: "Greek Letters",
    items: [
      { code: "\\alpha, \\beta, \\gamma" },
      { code: "\\Delta, \\Gamma, \\Omega" },
      { code: "\\pi, \\theta, \\lambda" }
    ]
  },
  {
    category: "Calculus",
    items: [
      { code: "\\int_{a}^{b} x^2 dx" },
      { code: "\\frac{d}{dx}" },
      { code: "\\lim_{x \\to \\infty}" },
      { code: "\\sum_{i=1}^{n}" },
      { code: "\\partial y / \\partial x" }
    ]
  },
  {
    category: "Sets & Logic",
    items: [
      { code: "A \\subset B" },
      { code: "x \\in \\mathbb{R}" },
      { code: "A \\cup B, A \\cap B" },
      { code: "\\forall x, \\exists y" }
    ]
  },
  {
    category: "Formatting",
    items: [
      { code: "\\frac{a}{b}" },
      { code: "\\sqrt{x}, \\sqrt[n]{x}" },
      { code: "x^2, y_i" },
      { code: "\\hat{y}, \\bar{x}, \\vec{v}" }
    ]
  }
];

export function CheatSheet() {
  return (
    <div className="flex flex-col h-full gap-6 overflow-auto pr-2 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cheatsheetData.map((section, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">{section.category}</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <tbody>
                  {section.items.map((item, j) => (
                    <tr key={j} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 w-1/3 border-r border-slate-100 font-medium text-lg flex items-center justify-center">
                        <InlineMath math={item.code} />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 bg-slate-50/50">
                        {item.code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
