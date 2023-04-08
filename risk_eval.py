import pandas as pd
import numpy as np
import time
import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

def risk_eval(prices):
    def format_date(ts):
        st = time.gmtime(ts / 1000)
        return time.strftime(r'%Y%m%d', st)

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

    # Read sol historical data
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

    data_user = pd.DataFrame()
    user = prices['user']
    # Read user's historical data
    ethereum_user = user['ethereum'][-30:]
    trade_date = [row[0] for row in ethereum_user]
    close = [row[1] for row in ethereum_user]
    ethereum_dict = {'trade_date': trade_date, 'close': close}
    data_user['ethereum'] = ethereum_dict['close']
    binancecoin_user = user['binancecoin'][-30:]
    trade_date = [row[0] for row in binancecoin_user]
    close = [row[1] for row in binancecoin_user]
    binancecoin_dict = {'trade_date': trade_date, 'close': close}
    data_user['binancecoin'] = binancecoin_dict['close']
    matic_user = user['matic-network'][-30:]
    trade_date = [row[0] for row in matic_user]
    close = [row[1] for row in matic_user]
    matic_dict = {'trade_date': trade_date, 'close': close}
    data_user['matic-network'] = matic_dict['close']
    solana_user = user['solana'][-30:]
    trade_date = [row[0] for row in solana_user]
    close = [row[1] for row in solana_user]
    solana_dict = {'trade_date': trade_date, 'close': close}
    data_user['solana'] = solana_dict['close']

    data_user['trade_date'] = ethereum_dict['trade_date']
    data_user.index = data_user['trade_date']
    data_user = data_user.drop(['trade_date'], axis=1)
    data_user = data_user.sort_index(ascending=True)

    log_returns = np.log(data_user / data_user.shift(1))
    rets_user = log_returns.dropna()

    covariance = np.cov(rets_user.values.squeeze(), rets.values.squeeze())[0][1]
    market_variance = np.var(rets.values.squeeze())
    beta = covariance / market_variance

    # Ratio of maximum retreat
    alpha = 0
    cumulative_pl = -14
    total_value = 211
    max_return = abs(cumulative_pl) / total_value # 6.64%
    if 0.0 < max_return < 0.05:
        alpha = 0
    elif 0.05 < max_return < 0.1:
        alpha = 1
    elif 0.1 < max_return < 0.15:
        alpha = 2
    elif 0.15 < max_return < 0.2:
        alpha = 3
    elif 0.2 < max_return:
        alpha = 4
    
    risk = round(beta * 0.5 + alpha * 0.5)
    return risk, beta
    