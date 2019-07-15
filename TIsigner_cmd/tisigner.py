#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 25 13:04:37 2019

@author: bikash
"""

import os
import sys
import re
import time
import argparse
from multiprocessing import Pool
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import numpy as np
from libs import data, functions


class SubstitutionException(Exception):
    '''Exception when codon substitution range greater then sequence.
    '''
    pass



def valid_input_seq(seq):
    '''check if given sequence is valid.
    '''
    seq = re.sub('\s+', '', seq.upper()).rstrip()
    pattern = re.compile('^[ATGCU]*$')
    cod = functions.Optimiser.splitter(seq)
    if list(set(cod[1:-1]) & set(data.STOP_CODONS)):
        raise argparse.ArgumentTypeError('Premature stop codons.')
    elif len(seq) < 75:
        raise argparse.ArgumentTypeError('Sequence too short. Min length = 75'
                                         +' nuclotides.')
    elif cod[0] != 'ATG':
        raise argparse.ArgumentTypeError('No start codon.')
    elif not pattern.match(seq):
        raise argparse.ArgumentTypeError('Unknown nucleotides.')
    elif len(seq)%3 != 0:
        raise argparse.ArgumentTypeError('Sequence is not divisible by 3.')

    return seq


def valid_rms(rms=None):
    '''check if given restriction modification site pattern is valid.
    '''
    if rms:
        pattern = re.compile('^[ACGTU]+(\,{0,1}[AGCTU])+$')
        valid_nt = re.compile('^[ATGCU]*$')
        if not pattern.match(rms):
            raise argparse.ArgumentTypeError('Please seperate multiple RMS '+
                                             'sites by single comma ",". ')
        if not valid_nt.match(('').join(i for i in rms.split(','))):
            raise argparse.ArgumentTypeError('Unknown nucleotides.')
    return rms


def get_threshold(n):
    '''return threshold opening energy(accessibility) from given
    score
    '''
    
    try:
        if int(n) < 5 or int(n) >100:
            raise argparse.ArgumentTypeError('Please input numbers in range '+
                                             '5 to 100 only. ')
        post_prob = (int(n) * \
                               (0.70 - functions.PRIOR_PROB)/100) + \
                     functions.PRIOR_PROB
        threshold = functions.get_accs(post_prob) #accs threshold
    except ValueError:
        raise argparse.ArgumentTypeError('Please input numbers in range '+
                                             '5 to 100 only. ')
    return threshold



def valid_utr(seq):
    '''validate UTR
    '''
    seq = re.sub('\s+', '', seq.upper()).rstrip()
    pattern = re.compile('^[ATGCU]*$')
    if len(seq) < 71:
        raise argparse.ArgumentTypeError('UTR is too short. Min 71 nts.')
    elif not pattern.match(seq):
        raise argparse.ArgumentTypeError('Unknown nucleotides.')
    return seq



def check_arg(args=None):
    '''arguments.
    '''
    parser = argparse.ArgumentParser(prog='TIsigner',
                         description=data.MANUAL,
                         epilog=data.AUTHORS)
    parser.add_argument('-v', '--version',
                        action='version',
                        version='%(prog)s ' + data.VERSION,
                        help="Show program's version number and exit.")
    parser.add_argument('-s', '--sequence',
                        type=valid_input_seq,
                        help='Input sequence',
                        required='True')
    parser.add_argument('-o', '--output',
                        help='Output file name.',
                        default='result')
    parser.add_argument('-c', '--codons',
                        help='Number of codons after start codon to consider '+
                        'for substitution. Pass "A" for full length '+
                        'substitution.',
                        default=9)
    parser.add_argument('-u', '--UTR',
                        type=valid_utr,
                        help="5'UTR. Default is pET21_NSEG. Min length is "+
                        '71 nucleotides. ',
                        default=data.pET21_UTR)
    parser.add_argument('-t', '--host',
                        help='The sequence will be optimised for this host.'+
                        'Choices are ecoli or yeast. Default ecoli.',
                        default='ecoli')
    parser.add_argument('-n', '--niter',
                        type=int,
                        help='Number of iterations for simulated annealing '+
                        'Default 50.',
                        default=50)
    parser.add_argument('-r', '--result',
                        type=int,
                        help='Number of result sequence to generate before '+
                        'selecting the top result.'+
                        ' Default 10. Max 50.',
                        default=20)
    parser.add_argument('-e', '--targetexpression',
                        type=get_threshold,
                        help='Target expression score to acheive in range 5'+
                        '(low) to 100(high). The target may or maynot be '+
                        'exactly reached due to other parameters. This '+
                        'feature applies to host Ecoli with pET21 promoter' +
                        ' only.')
    parser.add_argument('-f', '--filter',
                        type=valid_rms,
                        help='Sites to filter. Filters forward and reverse '+
                        'complements of AarI, BsaI, BsmBI by default.')
    parser.add_argument('-m', '--termcheck',
                        action='store_true',
                        help='Pass this arg if terminators should be checked.')
    parser.add_argument('-d', '--seed',
                        type=int,
                        help='Random number seed for algorithm.',
                        default=0)

    results = parser.parse_args(args)
    return (results.sequence,
            results.output,
            results.codons,
            results.UTR,
            results.host,
            results.niter,
            results.result,
            results.targetexpression,
            results.filter,
            results.termcheck,
            results.seed)


def main():


    #make dir for results
    mypath = os.path.join(os.getcwd(), 'results', '')
    if os.path.exists(mypath):
        pass
    else:
        os.makedirs(os.path.join(os.getcwd(), 'results', ''))






    if t == 'ecoli' and u == data.pET21_UTR:
        threshold = e

    else:
        threshold = None
    #instantitate optimisation with given parameters
    seeds = list(range(d, d + r))
    rand_states = [np.random.RandomState(i) for i in seeds]
    new_opt = functions.Optimiser(seq=str(s), host=t, ncodons=c, utr=u, \
                                   niter=n, threshold=threshold, \
                                   plfold_args=plfold_args, rms_sites=f)


    #run optimiser (multiprocess)
    pools = Pool(r)
    results = []
    functions.progress(0, r)
    for result in pools.imap(new_opt.simulated_anneal,\
                                rand_states):
        results.append(result)
        functions.progress(len(results), r)
    pools.close()
    pools.join()


    #format results in nice csv

    result_df = functions.sort_results(functions.sa_results_parse(results, \
                                        threshold=threshold, termcheck=m), \
                                       direction=new_opt.direction, termcheck=m)

    
    #fancy csv file for results
    cols = ['Type', 'Sequenceh', 'Accessibility', 'pExpressed', \
            'Hits', 'E_val', 'Mismatches']
    
    if 'Hits' not in result_df.columns:
        cols.remove('Hits')
        cols.remove('E_val')
    if 'pExpressed' not in result_df.columns:
        cols.remove('pExpressed')
    tmp_df = result_df[cols].copy()
    
    columns_rename = {'pExpressed':'Score',\
                   'Accessibility':'Opening Energy', \
                   'Sequenceh':'Sequence', 'Hits':'Term. Hits'}
    tmp_df.rename(columns=columns_rename, inplace='True')
    export_df = tmp_df.reindex(np.roll(tmp_df.index,\
                                       shift=1)).reset_index(drop=True)



    #export
    filename = mypath + o +'_'+time.strftime("%Y%m%d-%H%M%S")+'.csv'
    export_df.to_csv(filename, sep=',', encoding='utf-8', index=False)



    print('\nSummary: \n========')
    try:
        if m:
            print(export_df[['Type', 'Opening Energy', 'Score', 'Term. Hits']][:2])
        else:
            print(export_df[['Type', 'Opening Energy', 'Score']][:2])
    except KeyError:
        print(export_df[['Type', 'Opening Energy']][:2])
    print('\nPlease check results folder for full results!\n')



if __name__ == '__main__':
    s, o, c, u, t, n, r, e, f, m, d = check_arg(sys.argv[1:])
    s = s.upper()
    try:
        c = int(c) + 1
        if c*3 >= len(s):
            raise SubstitutionException("Substitution out of range.")
    except (ValueError, SubstitutionException) as exp:
        c = int((len(s) - len(s)%3)/3) - 1 #strip stop codon
    if t == 'yeast':
        plfold_args = data.RNAPLFOLD_YEAST
    elif t == 'ecoli':
        plfold_args = data.RNAPLFOLD_ECOLI
    else: #default to E coli
        t = 'ecoli'
        plfold_args = data.RNAPLFOLD_ECOLI
    if r > 50:
        r = 50
    main()

