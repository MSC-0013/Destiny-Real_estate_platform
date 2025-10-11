import Investment from "../models/Investment.js";

// 🧾 Create new investment
export const createInvestment = async (req, res) => {
  try {
    const data = req.body;

    // calculate profit and admin commission
    const profit = data.total_investment * (data.growth_percentage / 100);
    const admin_commission = profit * 0.01; // 1% for admin

    const newInvestment = new Investment({
      ...data,
      profit,
      admin_commission,
    });

    const saved = await newInvestment.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating investment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧭 Get all investments for a user
export const getInvestmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const investments = await Investment.find({ user_id: userId });
    res.json(investments);
  } catch (error) {
    console.error("Error fetching user investments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete investment
export const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    await Investment.findByIdAndDelete(id);
    res.json({ message: "Investment deleted" });
  } catch (error) {
    console.error("Error deleting investment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧮 Get all investors with total profits and admin commissions
export const getAllInvestorDetails = async (req, res) => {
  try {
    const allInvestments = await Investment.find();

    const investorsMap = {};

    allInvestments.forEach((inv) => {
      if (!investorsMap[inv.user_id]) {
        investorsMap[inv.user_id] = {
          investor_id: inv.user_id,
          investor_name: `Investor-${inv.user_id.slice(-4)}`,
          email: `user${inv.user_id.slice(-4)}@example.com`,
          total_invested: 0,
          total_profit: 0,
          admin_commission: 0,
          investments: [],
        };
      }

      investorsMap[inv.user_id].total_invested += inv.total_investment;
      investorsMap[inv.user_id].total_profit += inv.profit;
      investorsMap[inv.user_id].admin_commission += inv.admin_commission;
      investorsMap[inv.user_id].investments.push(inv);
    });

    res.json(Object.values(investorsMap));
  } catch (error) {
    console.error("Error fetching investor details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
