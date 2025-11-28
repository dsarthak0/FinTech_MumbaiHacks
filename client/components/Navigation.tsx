"use client"

import Link from "next/link"

interface Props {
	onAddExpense: () => void
	onAddIncome: () => void
}

export default function Navigation({ onAddExpense, onAddIncome }: Props) {
	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
			<div className="max-w-md mx-auto px-4 py-3 flex justify-around">
				<Link
					href="/"
					className="flex flex-col items-center gap-1 text-xs font-medium text-foreground hover:text-blue-600 transition-colors"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0V5m7 4l7-4"
						/>
					</svg>
					Dashboard
				</Link>
				<button
					onClick={onAddExpense}
					className="flex flex-col items-center gap-1 text-xs font-medium text-foreground hover:text-blue-600 transition-colors"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add Expense
				</button>
				<button
					onClick={onAddIncome}
					className="flex flex-col items-center gap-1 text-xs font-medium text-foreground hover:text-green-600 transition-colors"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add Income
				</button>
			</div>
		</nav>
	)
}
