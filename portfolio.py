
import pandas as pd
import numpy as np
import scipy.stats as scs
import scipy.optimize as sco
import scipy.interpolate as sci
import time
import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

def portfolio(prices):
    def format_date(ts):
        st = time.gmtime(ts / 1000)
        return time.strftime(r'%Y%m%d', st)
    
    noa = len(prices)
    data = pd.DataFrame()
    # Read eth historical data
    ethereum = prices['ethereum']
    trade_date = [row[0] for row in ethereum['prices']][-30:]
    trade_date = list(map(format_date, trade_date))
    close = [row[1] for row in ethereum['prices']][-30:]
    ethereum_dict = {'trade_date': trade_date, 'close': close}
    data['ethereum'] = ethereum_dict['close']

    # Read bnb historical data
    binancecoin = prices['binancecoin']
    trade_date = [row[0] for row in binancecoin['prices']][-30:]
    trade_date = list(map(format_date, trade_date))
    close = [row[1] for row in binancecoin['prices']][-30:]
    binancecoin_dict = {'trade_date': trade_date, 'close': close}
    data['binancecoin'] = binancecoin_dict['close']

    # Read matic historical data
    matic = prices['matic-network']
    trade_date = [row[0] for row in matic['prices']][-30:]
    trade_date = list(map(format_date, trade_date))
    close = [row[1] for row in matic['prices']][-30:]
    matic_dict = {'trade_date': trade_date, 'close': close}
    data['matic'] = matic_dict['close']
    
    # (If we have the sol historical data)
    solana = prices['solana']
    trade_date = [row[0] for row in solana['prices']][-30:]
    trade_date = list(map(format_date, trade_date))
    close = [row[1] for row in solana['prices']][-30:]
    solana_dict = {'trade_date': trade_date, 'close': close}
    data['solana'] = solana_dict['close']

    data['trade_date'] = ethereum_dict['trade_date']
    data['trade_date'] = pd.to_datetime(data['trade_date'])
    data.index = data['trade_date']
    data = data.drop(['trade_date'], axis=1)
    data = data.sort_index(ascending=True)

    log_returns = np.log(data / data.shift(1))
    rets = log_returns.dropna()
    # portfolio return
    def port_ret(weights):
        return np.sum(rets.mean() * weights) * 365
    # portfolio standard deviation
    def port_vol(weights):
        return np.sqrt(np.dot(weights.T,np.dot(rets.cov() * 365, weights)))
    prets = []
    pvols = []

    for p in range(2500):
        weights = np.random.random(noa)
        weights /= np.sum(weights)
        prets.append(port_ret(weights))
        pvols.append(port_vol(weights))
    prets = np.array(prets)
    pvols = np.array(pvols)

    cons = ({'type':'eq','fun':lambda x:port_ret(x) - tret},
        {'type': 'eq', 'fun':lambda x: np.sum(x) - 1}) # 有效边界的两个约束
    bnds = tuple((0, 1) for x in weights) # 参数范围
    eweights = np.array(noa * [1. / noa,]) # 等权重向量
    trets = np.linspace(prets.min(), prets.max(), 200) # 固定组合收益率水平
    tvols = []
    for tret in trets:
        res = sco.minimize(port_vol, eweights, method='SLSQP',
                        bounds=bnds,
                        constraints=cons)
        tvols.append(res['fun'])
    tvols = np.array(tvols)

    ind = np.argmin(tvols) # 最小波动率投资组合的指数头寸
    evols = tvols[ind:]    # 相关组合波动率
    erets = trets[ind:]    # 相关组合回报率
    tck = sci.splrep(evols, erets) # 3次样条插值

    def f(x): # 求有效前沿的函数f(x)
        return sci.splev(x, tck, der=0)
    def df(x): # 求有效前沿函数一阶导
        return sci.splev(x, tck, der=1)

    def equations(p, rf=0.0):
        eq1 = rf - p[0]
        eq2 = rf + p[1] * p[2] - f(p[2])
        eq3 = p[1] - df(p[2])
        return eq1, eq2, eq3

    opt = sco.fsolve(equations, [0.0, 2.95, 0.575]) # 给定初始解,可以通过有效前沿大致猜测

    cons = ({'type':'eq', 'fun': lambda x:port_ret(x) - f(opt[2])},
        {'type':'eq', 'fun': lambda x: np.sum(x) - 1})
    res = sco.minimize(port_vol, eweights, method='SLSQP',
                    bounds=bnds, constraints=cons)
    w = res['x']
    init_ret = port_ret(np.array([0.4, 0.01, 0.01, 0.58]))
    init_vol = port_vol(np.array([0.4, 0.01, 0.01, 0.58]))

    improved_ret = (port_ret(w) - init_ret) / init_ret
    improved_vol = (port_vol(w) - init_vol) / init_vol
    # ETH | BNB | MATIC | SOL
    return list(w), [improved_ret, improved_vol]