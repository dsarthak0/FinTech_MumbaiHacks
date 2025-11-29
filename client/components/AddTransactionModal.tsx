"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { autoCategorizeTransaction } from "@/lib/autoCategorize"

interface Props {
  type: "income" | "expense"
  onClose: () => void
  onAdd: () => void
}

export default function AddTransactionModal({ type, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const [avgSpending, setAvgSpending] = useState({
    Transport: "",
    Healthcare: "",
    Shopping: "",
    Subscriptions: "",
    Utilities: "",
    "Food & Drinks": "",
  })

  const categories = db.getCategories().filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    let selectedCategory = category
    if (!selectedCategory) {
      selectedCategory = autoCategorizeTransaction(description)
    }

    // Add transaction
    db.addTransaction({
      type,
      amount: Number.parseInt(amount),
      category: selectedCategory,
      description,
      date: new Date(),
    })

    // Save avg monthly spending
    db.setUserAvgSpending(avgSpending)

    onAdd()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-card rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Add {type === "income" ? "Income" : "Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you spend/earn on?"
              required
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Auto-detect</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Average Monthly Spending Inputs */}
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Average Monthly Spending (₹)</h3>
            {Object.keys(avgSpending).map((cat) => (
              <div key={cat} className="mb-2">
                <label className="block text-sm mb-1">{cat}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={avgSpending[cat as keyof typeof avgSpending]}
                  onChange={(e) =>
                    setAvgSpending((prev) => ({
                      ...prev,
                      [cat]: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add {type === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
