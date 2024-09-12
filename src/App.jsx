import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Switch } from "./components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Progress } from "./components/ui/progress";
import { CreditCard, Lock, Unlock, Bell, Mail, Search, ChevronLeft, ChevronRight, DollarSign, Globe, Users, Camera, MessageSquare, Send, Settings as SettingsIcon, Wifi } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const BankingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [accountBalance, setAccountBalance] = useState(25000.75);
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Grocery Store', amount: -85.20, date: '2023-06-15', category: 'Food' },
    { id: 2, description: 'Salary Deposit', amount: 3500.00, date: '2023-06-14', category: 'Income' },
    { id: 3, description: 'Electric Bill', amount: -120.50, date: '2023-06-13', category: 'Utilities' },
    { id: 4, description: 'Online Shopping', amount: -65.99, date: '2023-06-12', category: 'Shopping' },
  ]);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your credit card payment is due in 3 days.', type: 'warning' },
    { id: 2, message: 'You\'ve received a new statement for your savings account.', type: 'info' },
  ]);
  const [virtualCards, setVirtualCards] = useState([
    { id: 1, last4: '0000', expiryDate: '12/24', spendingLimit: 500, isActive: true },
  ]);
  const [showVirtualCardModal, setShowVirtualCardModal] = useState(false);
  const [newVirtualCardLimit, setNewVirtualCardLimit] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [currencies, setCurrencies] = useState(['USD', 'EUR', 'GBP']);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 0.85, GBP: 0.75 });
  const [articles, setArticles] = useState([
    { id: 1, title: "Understanding Credit Scores", content: "Your credit score is a numerical expression of your creditworthiness..." },
    { id: 2, title: "Investing for Beginners", content: "Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit..." },
    { id: 3, title: "Budgeting 101", content: "A budget is a financial plan for a defined period, typically one year..." },
  ]);
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [currentSavings, setCurrentSavings] = useState(2500);
  const [carbonFootprint, setCarbonFootprint] = useState(1250);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you with your banking needs today?' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [investments, setInvestments] = useState([
    { id: 1, name: 'Tech Stocks', value: 5000, growth: 0.05 },
    { id: 2, name: 'Real Estate Fund', value: 10000, growth: 0.03 },
    { id: 3, name: 'Government Bonds', value: 3000, growth: 0.02 },
  ]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const interval = setInterval(() => {
      setAccountBalance(prevBalance => {
        const fluctuation = (Math.random() - 0.5) * 100;
        return Math.round((prevBalance + fluctuation) * 100) / 100;
      });

      setInvestments(prevInvestments => 
        prevInvestments.map(inv => ({
          ...inv,
          value: inv.value * (1 + (Math.random() - 0.5) * 0.01),
        }))
      );

      if (Math.random() > 0.7) {
        const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];
        const newTransaction = {
          id: Date.now(),
          description: `Transaction ${Math.floor(Math.random() * 1000)}`,
          amount: Math.round((Math.random() - 0.5) * 200 * 100) / 100,
          date: new Date().toISOString().split('T')[0],
          category: categories[Math.floor(Math.random() * categories.length)],
        };
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions.slice(0, 9)]);
        
        setCarbonFootprint(prevFootprint => prevFootprint + Math.abs(newTransaction.amount * 0.1));
      }

      if (Math.random() > 0.9) {
        const newNotification = {
          id: Date.now(),
          message: `New notification ${Math.floor(Math.random() * 100)}`,
          type: Math.random() > 0.5 ? 'info' : 'warning',
        };
        setNotifications(prevNotifications => [newNotification, ...prevNotifications.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setExchangeRates({ USD: 1, EUR: 0.85, GBP: 0.75 });
    };
    fetchExchangeRates();
  }, []);

  const convertCurrency = (amount, from, to) => {
    if (from === to) return amount;
    return amount * (exchangeRates[to] / exchangeRates[from]);
  };

  const handleTransferMoney = useCallback(() => {
    if (transferAmount && transferRecipient) {
      const amount = parseFloat(transferAmount);
      if (amount > 0 && amount <= accountBalance) {
        setAccountBalance(prevBalance => Math.round((prevBalance - amount) * 100) / 100);
        const newTransaction = {
          id: Date.now(),
          description: `Transfer to ${transferRecipient}`,
          amount: -amount,
          date: new Date().toISOString().split('T')[0],
          category: 'Transfer',
        };
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
        setTransferAmount('');
        setTransferRecipient('');
        setNotifications(prevNotifications => [{
          id: Date.now(),
          message: `Successfully transferred $${amount} to ${transferRecipient}`,
          type: 'success',
        }, ...prevNotifications]);
        setIsAlertOpen(false);
      }
    }
  }, [transferAmount, transferRecipient, accountBalance]);

  const toggleAccountLock = useCallback(() => {
    setIsAccountLocked(prevState => !prevState);
    setNotifications(prevNotifications => [{
      id: Date.now(),
      message: `Account ${isAccountLocked ? 'unlocked' : 'locked'} successfully`,
      type: 'info',
    }, ...prevNotifications]);
  }, [isAccountLocked]);

  const generateVirtualCard = () => {
    if (virtualCards.length < 3) {
      const newCard = {
        id: Date.now(),
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        expiryDate: `${new Date().getMonth() + 1}/${new Date().getFullYear() + 3}`,
        spendingLimit: parseFloat(newVirtualCardLimit),
        isActive: true
      };
      setVirtualCards(prev => [...prev, newCard]);
      setShowVirtualCardModal(false);
      setNewVirtualCardLimit('');
      setNotifications(prevNotifications => [{
        id: Date.now(),
        message: `New virtual card created with spending limit of $${newVirtualCardLimit}`,
        type: 'success',
      }, ...prevNotifications]);
    } else {
      setNotifications(prevNotifications => [{
        id: Date.now(),
        message: "You've reached the maximum number of virtual cards.",
        type: 'warning',
      }, ...prevNotifications]);
    }
  };

  const handleReportCard = (cardId) => {
    setVirtualCards(prev => prev.map(card => 
      card.id === cardId ? {...card, isActive: false} : card
    ));
    setShowReportModal(false);
    setReportReason('');
    setNotifications(prev => [{
      id: Date.now(),
      message: `Virtual card ending in ${virtualCards.find(c => c.id === cardId).last4} has been deactivated.`,
      type: 'warning',
    }, ...prev]);
  };

  const handleAddToSavings = (amount) => {
    if (accountBalance >= amount) {
      setCurrentSavings(prev => prev + amount);
      setAccountBalance(prev => prev - amount);
      setNotifications(prev => [{
        id: Date.now(),
        message: `Added $${amount} to your savings goal.`,
        type: 'success',
      }, ...prev]);
    } else {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Insufficient funds to add $${amount} to savings.`,
        type: 'warning',
      }, ...prev]);
    }
  };

  const handleOffsetCarbon = () => {
    const offsetCost = carbonFootprint * 0.1;
    if (accountBalance >= offsetCost) {
      setAccountBalance(prev => prev - offsetCost);
      setCarbonFootprint(0);
      setNotifications(prev => [{
        id: Date.now(),
        message: `Carbon footprint offset for $${offsetCost.toFixed(2)}. Thank you for your contribution!`,
        type: 'success',
      }, ...prev]);
    } else {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Insufficient funds to offset carbon footprint.`,
        type: 'warning',
      }, ...prev]);
    }
  };

  const handleSendChatMessage = () => {
    if (newChatMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: 'user', text: newChatMessage }]);
      setNewChatMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, I'm a demo AI and can't provide real assistance." }]);
      }, 1000);
    }
  };

  const handleInvest = (amount) => {
    if (accountBalance >= amount && selectedInvestment) {
      setAccountBalance(prev => prev - amount);
      setInvestments(prev => prev.map(inv => 
        inv.id === selectedInvestment.id ? {...inv, value: inv.value + amount} : inv
      ));
      setNotifications(prev => [{
        id: Date.now(),
        message: `Successfully invested $${amount} in ${selectedInvestment.name}.`,
        type: 'success',
      }, ...prev]);
      setShowInvestmentModal(false);
    } else {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Insufficient funds to invest $${amount}.`,
        type: 'warning',
      }, ...prev]);
    }
  };

  const VirtualCardComponent = ({ card }) => (
    <Card className="mb-4 relative overflow-hidden w-96 h-56 rounded-xl shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500"></div>
      <CardContent className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="text-white font-bold text-xl">MyBank</div>
          <Wifi className="text-white" size={24} />
        </div>
        <div className="text-white font-mono text-2xl mt-4">
          5300 **** **** {card.last4}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white text-xs opacity-75">Valid Thru</p>
            <p className="text-white font-semibold">{card.expiryDate}</p>
          </div>
          <div>
            <p className="text-white text-xs opacity-75">Cardholder Name</p>
            <p className="text-white font-semibold">JOHN DOE</p>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Settings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Enable Notifications</span>
          <Switch
            checked={enableNotifications}
            onCheckedChange={setEnableNotifications}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Two-Factor Authentication</span>
          <Switch
            checked={enableTwoFactor}
            onCheckedChange={setEnableTwoFactor}
          />
        </div>
      </CardContent>
    </Card>
  );

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Account Balance',
        data: [20000, 22000, 21500, 23000, 24500, accountBalance],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Balance Trend'
      }
    }
  };

  const expenseChartData = {
    labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: [300, 150, 200, 250, 180, 120],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const investmentChartData = {
    labels: investments.map(inv => inv.name),
    datasets: [
      {
        label: 'Investment Portfolio',
        data: investments.map(inv => inv.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const FinancialLiteracyComponent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Financial Literacy Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {articles.map(article => (
            <li key={article.id}>
              <Button variant="link" onClick={() => alert(article.content)}>{article.title}</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const SavingsGoalComponent = () => {
    const progress = (currentSavings / savingsGoal) * 100;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span>Progress: {progress.toFixed(2)}%</span>
            <span>{selectedCurrency} {convertCurrency(currentSavings, 'USD', selectedCurrency).toFixed(2)} / {convertCurrency(savingsGoal, 'USD', selectedCurrency).toFixed(2)}</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="mt-4 space-x-2">
            <Button onClick={() => handleAddToSavings(100)}>Add $100</Button>
            <Button onClick={() => handleAddToSavings(500)}>Add $500</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SustainabilityComponent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Footprint</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your estimated carbon footprint based on spending: {carbonFootprint.toFixed(2)} kg CO2</p>
        <Button className="mt-4" onClick={handleOffsetCarbon}>Offset Carbon (${(carbonFootprint * 0.1).toFixed(2)})</Button>
      </CardContent>
    </Card>
  );

  const ChatbotComponent = () => (
    <Card className={`fixed bottom-4 right-4 w-80 ${chatbotOpen ? 'h-96' : 'h-12'} transition-all duration-300`}>
      <CardHeader className="cursor-pointer" onClick={() => setChatbotOpen(!chatbotOpen)}>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      {chatbotOpen && (
        <>
          <CardContent className="h-64 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Input
              placeholder="Ask a question..."
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              className="mr-2"
            />
            <Button onClick={handleSendChatMessage}>
              <Send size={20} />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );

  const InvestmentComponent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Investment Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <Doughnut data={investmentChartData} />
        <div className="mt-4">
          {investments.map(inv => (
            <div key={inv.id} className="flex justify-between items-center mb-2">
              <span>{inv.name}</span>
              <span>{selectedCurrency} {convertCurrency(inv.value, 'USD', selectedCurrency).toFixed(2)}</span>
              <Button onClick={() => {
                setSelectedInvestment(inv);
                setShowInvestmentModal(true);
              }}>
                Invest More
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl font-bold mb-8">Banking Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                <CardHeader>
                  <CardTitle>Account Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">{selectedCurrency} {convertCurrency(accountBalance, 'USD', selectedCurrency).toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
                <CardHeader>
                  <CardTitle>Credit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">750</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
                <CardHeader>
                  <CardTitle>Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">{selectedCurrency} {convertCurrency(investments.reduce((sum, inv) => sum + inv.value, 0), 'USD', selectedCurrency).toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
                  <CardHeader>
                    <CardTitle>Account Balance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Line data={chartData} options={chartOptions} />
                  </CardContent>
                </Card>

                <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
                  <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Doughnut data={expenseChartData} />
                  </CardContent>
                </Card>

                <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-3">Description</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b last:border-b-0">
                              <td className="py-3">{transaction.description}</td>
                              <td className={`py-3 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {selectedCurrency} {convertCurrency(Math.abs(transaction.amount), 'USD', selectedCurrency).toFixed(2)}
                              </td>
                              <td className="py-3">{transaction.date}</td>
                              <td className="py-3">{transaction.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Tabs defaultValue="actions" className="w-full">
                  <TabsList>
                    <TabsTrigger value="actions">Quick Actions</TabsTrigger>
                    <TabsTrigger value="cards">Virtual Cards</TabsTrigger>
                    <TabsTrigger value="literacy">Financial Literacy</TabsTrigger>
                  </TabsList>
                  <TabsContent value="actions">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                          <AlertDialogTrigger asChild>
                            <Button className="w-full" onClick={() => setIsAlertOpen(true)}>
                              Transfer Money
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Transfer Money</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the details for your money transfer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="amount" className="text-right">
                                  Amount
                                </label>
                                <Input
                                  id="amount"
                                  type="number"
                                  className="col-span-3"
                                  value={transferAmount}
                                  onChange={(e) => setTransferAmount(e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="recipient" className="text-right">
                                  Recipient
                                </label>
                                <Input
                                  id="recipient"
                                  className="col-span-3"
                                  value={transferRecipient}
                                  onChange={(e) => setTransferRecipient(e.target.value)}
                                />
                              </div>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleTransferMoney}>Transfer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          className={`w-full ${
                            isAccountLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          }`}
                          onClick={toggleAccountLock}
                        >
                          {isAccountLocked ? <Unlock size={20} className="mr-2" /> : <Lock size={20} className="mr-2" />}
                          {isAccountLocked ? 'Unlock Account' : 'Lock Account'}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="cards">
                    {virtualCards.map(card => (
                      <VirtualCardComponent key={card.id} card={card} />
                    ))}
                    {virtualCards.length < 3 && (
                      <Button className="w-full mt-4" onClick={() => setShowVirtualCardModal(true)}>
                        <CreditCard size={20} className="mr-2" />
                        Generate New Virtual Card
                      </Button>
                    )}
                  </TabsContent>
                  <TabsContent value="literacy">
                    <FinancialLiteracyComponent />
                  </TabsContent>
                </Tabs>

                <SavingsGoalComponent />
                <SustainabilityComponent />
                <InvestmentComponent />
              </div>
            </div>
          </>
        );
      case 'accounts':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Accounts</h2>
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Account Number: ****1234</p>
                <p>Account Type: Checking</p>
                <p>Available Balance: {selectedCurrency} {convertCurrency(accountBalance, 'USD', selectedCurrency).toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'investments':
        return <InvestmentComponent />;
      case 'transfers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Transfers</h2>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button className="w-full" onClick={() => setIsAlertOpen(true)}>
                  Transfer Money
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Transfer Money</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the details for your money transfer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right">
                      Amount
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      className="col-span-3"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="recipient" className="text-right">
                      Recipient
                    </label>
                    <Input
                      id="recipient"
                      className="col-span-3"
                      value={transferRecipient}
                      onChange={(e) => setTransferRecipient(e.target.value)}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTransferMoney}>Transfer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
        // New function to add more to the transfers
      case 'mobile-deposit':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Mobile Deposit</h2>
            <Card>
              <CardHeader>
                <CardTitle>Deposit a Check</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Let add more function to it */}
                <p>To deposit a check, follow these steps:</p>
                <ol className="list-decimal list-inside mt-2">
                  <li>Endorse the back of the check</li>
                  <li>Take a clear photo of the front and back of the check</li>
                  <li>Enter the check amount</li>
                  <li>Select the account for deposit</li>
                  <li>Submit the deposit</li>
                </ol>
                <Button className="mt-4">Start Deposit Process</Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <h2 className="text-2xl font-bold">Page Not Found</h2>;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-blue-600 mr-8">MyBank</h2>
            <div className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search..."
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} pl-10`}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail size={20} />
            </Button>
            <div className="flex items-center space-x-2">
              <img
                src="/api/placeholder/32/32"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium hidden sm:inline`}>John Doe</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
          <div className="p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`mt-4 ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          <nav className="mt-8">
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <DollarSign className="mr-2" size={20} />
              {isSidebarOpen && "Dashboard"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'accounts' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('accounts')}>
              <CreditCard className="mr-2" size={20} />
              {isSidebarOpen && "Accounts"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'investments' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('investments')}>
              <Globe className="mr-2" size={20} />
              {isSidebarOpen && "Investments"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'transfers' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('transfers')}>
              <Users className="mr-2" size={20} />
              {isSidebarOpen && "Transfers"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'mobile-deposit' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('mobile-deposit')}>
              <Camera className="mr-2" size={20} />
              {isSidebarOpen && "Mobile Deposit"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${activeTab === 'settings' ? 'bg-blue-100 text-blue-600' : ''}`} onClick={() => setActiveTab('settings')}>
              <SettingsIcon className="mr-2" size={20} />
              {isSidebarOpen && "Settings"}
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Virtual Card Modal */}
      <AlertDialog open={showVirtualCardModal} onOpenChange={setShowVirtualCardModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Virtual Card</AlertDialogTitle>
            <AlertDialogDescription>
              Set a spending limit for your new virtual card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Spending Limit"
              value={newVirtualCardLimit}
              onChange={(e) => setNewVirtualCardLimit(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={generateVirtualCard}>Generate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Card Modal */}
      <AlertDialog open={showReportModal} onOpenChange={setShowReportModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Virtual Card</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for reporting this card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for reporting"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleReportCard(virtualCards[virtualCards.length - 1].id)}>
              Report and Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Investment Modal */}
      <AlertDialog open={showInvestmentModal} onOpenChange={setShowInvestmentModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invest in {selectedInvestment?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the amount you want to invest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Investment Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleInvest(parseFloat(transferAmount))}>Invest</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChatbotComponent />
    </div>
  );
};

export default BankingDashboard;