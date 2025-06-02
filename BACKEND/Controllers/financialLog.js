import Financial from "../models/financialModel.js";
import dayjs from "dayjs"

export const createFinancialIncome = async (req, res) => {
  try {
    const { income, accountsAdjustments = [], expenses = [] } = req.body;

    // Fix property names (match the schema exactly)
    const incomeTotal = 
      (income?.zdollar || 0) +
      (income?.zcash?.converted || 0) +
      (income?.edahabCash?.converted || 0) +
      (income?.Cash?.converted || 0) +
      (income?.dollar || 0) +
      (income?.account?.converted || 0);

    const adjustmentsTotal = accountsAdjustments.reduce(
      (sum, adj) => sum + (adj.value || 0),
      0
    );

    const expensesTotal = expenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    const combinedTotal = incomeTotal + expensesTotal;
    const balance = combinedTotal + adjustmentsTotal;

    const newFinancialLog = new Financial({
      income,
      accountsAdjustments,
      expenses,
      totals: {
        incomeTotal,
        adjustmentsTotal,
        combinedTotal,
        expensesTotal,
        balance
      }
    });

    await newFinancialLog.save();

    res.status(201).json({
      message: "Today's financial log created successfully",
      data: newFinancialLog
    });
  } catch (error) {
    console.error("Error in creating financial log", error);
    res.status(500).json({ message: error.message });
  }
};




export const getFinancialLogsByDate = async (req, res) => {
  try {
    const { date } = req.params; // expected: '2025-05-30'
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    const logs = await Financial.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    // ✅ Check if array is empty
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No data found for this specific date" });
    }

    res.status(200).json({ data: logs });

  } catch (error) {
    console.error("Error fetching financial logs by date:", error);
    res.status(500).json({ message: error.message });
  }
};