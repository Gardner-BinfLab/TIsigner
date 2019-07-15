#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  7 20:55:11 2019

@author: bikash
"""

#DEFAULT SETTINGS AND CONSTANTS
STOP_CODONS = ['TAG', 'TAA', 'TGA']

AA_TO_CODON = {'A' : ['GCT', 'GCC', 'GCA', 'GCG'],
               'C' : ['TGT', 'TGC'],
               'D' : ['GAT', 'GAC'],
               'E' : ['GAA', 'GAG'],
               'F' : ['TTT', 'TTC'],
               'G' : ['GGT', 'GGC', 'GGA', 'GGG'],
               'H' : ['CAT', 'CAC'],
               'I' : ['ATT', 'ATC', 'ATA'],
               'K' : ['AAG', 'AAA'],
               'L' : ['TTA', 'TTG', 'CTT', 'CTC', 'CTG', 'CTA'],
               'M' : ['ATG'],
               'N' : ['AAT', 'AAC'],
               'P' : ['CCT', 'CCC', 'CCA', 'CCG'],
               'Q' : ['CAA', 'CAG'],
               'R' : ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
               'S' : ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'],
               'T' : ['ACT', 'ACC', 'ACA', 'ACG'],
               'V' : ['GTT', 'GTC', 'GTA', 'GTG'],
               'W' : ['TGG'],
               'Y' : ['TAT', 'TAC']}


CODON_TO_AA = {'TTT' : 'F', 'TCT' : 'S', 'TAT' : 'Y', 'TGT' : 'C',
               'TTC' : 'F', 'TCC' : 'S', 'TAC' : 'Y', 'TGC' : 'C',
               'TTA' : 'L', 'TCA' : 'S', 'TTG' : 'L', 'TCG' : 'S',
               'TGG' : 'W', 'CTT' : 'L', 'CCT' : 'P', 'CAT' : 'H',
               'CGT' : 'R', 'CTC' : 'L', 'CCC' : 'P', 'CAC' : 'H',
               'CGC' : 'R', 'CTA' : 'L', 'CCA' : 'P', 'CAA' : 'Q',
               'CGA' : 'R', 'CTG' : 'L', 'CCG' : 'P', 'CAG' : 'Q',
               'CGG' : 'R', 'ATT' : 'I', 'ACT' : 'T', 'AAT' : 'N',
               'AGT' : 'S', 'ATC' : 'I', 'ACC' : 'T', 'AAC' : 'N',
               'AGC' : 'S', 'ATA' : 'I', 'ACA' : 'T', 'AAA' : 'K',
               'AGA' : 'R', 'ATG' : 'M', 'ACG' : 'T', 'AAG' : 'K',
               'AGG' : 'R', 'GTT' : 'V', 'GCT' : 'A', 'GAT' : 'D',
               'GGT' : 'G', 'GTC' : 'V', 'GCC' : 'A', 'GAC' : 'D',
               'GGC' : 'G', 'GTA' : 'V', 'GCA' : 'A', 'GAA' : 'E',
               'GGA' : 'G', 'GTG' : 'V', 'GCG' : 'A', 'GAG' : 'E',
               'GGG' : 'G'}


CNST = 100000 #prevent overflows 
pET21_UTR = 'GGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACAT'
UTR5_AOX1_promoter = 'ACCTTTTTTTTTATCATCATTATTAGCTTACTTTCATAATTGCGACTGGTTCCAATTGACAAGCTTTTGATTTTAACGACTTTTAACGACAACTTGAGAAGATCAAAAAACAACTAATTATTCGAAACC'
RNAPLFOLD_ECOLI = '-W 210 -u 50 -O'
RNAPLFOLD_YEAST  = '-W 210 -u 70 -O'
RANDOM_SEED = 12345
RMS_SITES = 'TTTTT|CACCTGC|GCAGGTG|GGTCTC|GAGACC|CGTCTC|GAGACG'
ACCS_POS = {'yeast':[58, 66],'ecoli':[24,48]} #nt_pos, subseg_length



#For web input
UTR_INPUT = {'1':pET21_UTR, '2':UTR5_AOX1_promoter}
HOST_INPUT = {'Pichia pastoris':['yeast', RNAPLFOLD_YEAST],
              'Escherichia coli':['ecoli', RNAPLFOLD_ECOLI]}

#algorithm settings = [number of iterations, number of sequences to gen]
ALGORITHM_SETTINGS = {'deep':[100, 10], 'quick':[50, 5]}




#INFO AND MANUAL
VERSION =  '1.0'
AUTHORS = 'Bikash<bikash.bhandari@postgrad.otago.ac.nz> '+\
' Lim<chunshen.lim@otago.ac.nz> '+\
' Gardner-Binflab (2019)'
MANUAL = 'Translation Initiation coding region deSIGNER.'