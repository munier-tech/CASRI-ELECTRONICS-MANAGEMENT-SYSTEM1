import mongoose from "mongoose";

const financialSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },

  income: {
    zdollar: {
      type: Number,
    },
    zcash: {
      raw: {
        type: Number,
      },
      converted: { 
        type: Number, 
      }
    },
    edahab: {
      raw: { 
        type: Number,
      },
    },
    edahabCash : {
      raw : {
      type: Number,
      
      },
      converted: {
      type: Number,
      }
    },
    Cash : {
      raw : {
      type: Number,
      
      },
      converted: {
      type: Number,
      }
    },
    dollar: {
      type: Number,
    },
    account: {
      raw: { 
      type: Number,  
      },
      converted: {
      type: Number,
      }
    }
  },

  accountsAdjustments: [
    {
      label: 
      { 
       type: String,
       default: "Acc"
      },
      value: { 
        type: Number,
        required: true
      }
    }
  ],

  expenses: [
    {
      name: { 
        type: String,
      },
      amount: { 
        type: Number,
      }
    }
  ],

  totals: {
    incomeTotal: Number,
    adjustmentsTotal: Number,
    combinedTotal: Number,
    expensesTotal: Number,
    balance: Number
  }
});

const Financial = mongoose.model("Financial", financialSchema);

export default Financial;
