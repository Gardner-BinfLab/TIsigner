#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 20 10:36:23 2019

@author: bikash
"""



import os
from multiprocessing import Pool
from flask_wtf.csrf import CSRFProtect
from flask import Flask
from flask import request
from flask import render_template
from flask import make_response
import numpy as np
import functions
from functions import Optimiser
import data



#flask setup
SECRET_KEY = os.urandom(32)
csrf = CSRFProtect()
app = Flask(__name__)
csrf.init_app(app)
app.config['SECRET_KEY'] = SECRET_KEY

@app.route('/')
def my_form():
    '''render homepage'''
    return render_template("index.html")



@app.route('/optimise', methods=["POST"])
def get_results():
    '''Optimisation
    '''
    try:
        seq, ncodons = functions.parse_input_sequence(request.form)
        utr = functions.parse_input_utr(request.form)
        host, plfold_args = functions.parse_hosts(request.form)
        niter, num_seq = functions.parse_algorithm_settings(request.form)
        rms = functions.parse_input_rms(request.form)
        if utr == data.pET21_UTR and host == 'ecoli':
            threshold = functions.parse_fine_tune(request.form)
        else:
            threshold = None


        termcheck = functions.parse_term_check(request.form)

        seed = functions.parse_seed(request.form)
        seeds = list(range(seed, seed+num_seq))
        rand_states = [np.random.RandomState(i) for i in seeds]
        new_opt = Optimiser(seq=seq, host=host, ncodons=ncodons, utr=utr, \
                         niter=niter, threshold=threshold, plfold_args=plfold_args, \
                         rms_sites=rms)


        pools = Pool(num_seq)
        results = []
        for result in pools.imap(new_opt.simulated_anneal,\
                                    rand_states):
            results.append(result)
        pools.close()
        pools.join()

        result_df = functions.sort_results(functions.sa_results_parse(results,\
                                            threshold=threshold, \
                                            termcheck=termcheck),\
            termcheck=termcheck)

        json_data = result_df.groupby(['Type', 'Sequenceh'], sort=False).apply(lambda x:\
                                     functions.send_data(x, utr=utr, 
                                    host=host)).groupby(level=0).\
                                     apply(lambda x: x.tolist()).to_json(\
                                          orient='columns')
        return json_data
    
    
    except Exception as exp:
        if 'pools' in locals():
            pools.close()
            pools.join()
        return make_response(str(exp), 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', threaded=True, debug=True)
