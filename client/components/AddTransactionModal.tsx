"use client"

import type React from "react"

import { useState } from "react"
import { autoCategorizeTransaction } from "@/lib/utils/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"

interface Props {
  type: "income" | "expense"
  onClose: () => void
  onAdd: () => void
}

export default function AddTransactionModal({ type, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const categories = db.getCategories().filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    let selectedCategory = category
    if (!selectedCategory) {
      selectedCategory = autoCategorizeTransaction(description)
    }

    db.addTransaction({
      type,
      amount: Number.parseInt(amount),
      category: selectedCategory,
      description,
      date: new Date(),
    })

    onAdd()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-lg p-6 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add {type === "income" ? "Income" : "Expense"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
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
