
# TIsigner command line version

![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg)
### The [web version](https://github.com/Gardner-BinfLab/TISIGNER-ReactJS) is currently maintained. 

##### Dependencies
You need to have python 3.6+ installed. The required python dependencies can be installed by

```pip3  install --user -r requirements.txt ```

We also require ViennaRNA suite to be installed on your machine. The instructions to do so can be found [here](https://www.tbi.univie.ac.at/RNA/documentation.html#install).
###### Optional
TIsigner can also check for terminators if you have Infernal installed on your machine. Instructions to install Infernal can be found [here](http://eddylab.org/infernal/).

Once you've installed the dependencies, you can enter the following command:

```python3 tisigner.py -h```

This will print a help of all possible commands. 
```
usage: TIsigner [-h] [-v] -s SEQUENCE [-o OUTPUT] [-c CODONS] [-u UTR]
                [-t HOST] [-n NITER] [-r RESULT] [-e TARGETOPENINGENERGY]
                [-f FILTER] [-m] [-d SEED]

Translation Initiation coding region deSIGNER.

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         Show program's version number and exit.
  -s SEQUENCE, --sequence SEQUENCE
                        Input sequence
  -o OUTPUT, --output OUTPUT
                        Output file name.
  -c CODONS, --codons CODONS
                        Number of codons after start codon to consider for
                        substitution. Pass "A" for full length substitution.
  -u UTR, --UTR UTR     5'UTR. Default is pET21_NSEG. Min length is 71
                        nucleotides.
  -t HOST, --host HOST  The sequence will be optimised for this host.Choices
                        are ecoli or yeast. Default ecoli.
  -n NITER, --niter NITER
                        Number of iterations for simulated annealing Default
                        50.
  -r RESULT, --result RESULT
                        Number of result sequence to generate before selecting
                        the top result. Default 10. Max 50.
  -e TARGETOPENINGENERGY, --targetopeningenergy TARGETOPENINGENERGY
                        Target opening energy to acheive in range 5 to 30. The
                        target may or maynot be exactly reached due to other
                        parameters. This feature applies to host E.coli with
                        pET21 promoter only.
  -f FILTER, --filter FILTER
                        Sites to filter. Filters forward and reverse
                        complements of AarI, BsaI, BsmBI by default.
  -m, --termcheck       Pass this arg if terminators should be checked.
  -d SEED, --seed SEED  Random number seed for algorithm.

Bikash<bikash.bhandari@postgrad.otago.ac.nz> Lim<chunshen.lim@otago.ac.nz>
Gardner-Binflab (2019)
```

An example use:

```python3 tisigner.py -s ATGAAGAAATCTCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCT```
```TCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG```

This will optimise the sequence for *Escherichia coli* with T7lac promoter by doing a synonymous subsitution on maximum of initial 9 codons only. The output is exported to results folder.


 - The output file is a ```.csv``` with type of sequence and properties. ```Selected``` is the sequence considered as best matching to input parameters. ```Optimised``` are other solutions close to the selected sequences. Mismatching nucleotides are printed in lowercase letters.
 
    | Type | Sequence | Opening energy | Score | Mismatches|
    | ------ | ------ | ------ | ------ | ------ |
    | Input | ... | ... | ... | ... |
    | Selected | ... | ... | ... | ... |
    | Optimised | ... | ... | ... | ... |
    | Optimised | ... | ... | ... | ... |
    | ... | ... | ... | ... | ... |
    
If you passed the argument to check terminators, hits and their respective E values are also printed in exported file. 
    
# Using TIsigner in your program
TIsigner is written using object oriented programming principles and allows easy inclusion to your scripts. You just need to copy libs folder to appropriate destination. Then you can import Optimiser class as follows:

```from libs.functions import Optimiser```

You can now instantiate Optimiser class with appropriate parameters:

```my_opt = Optimiser(seq, host='ecoli', ncodons=None, utr=None, niter=None, threshold=None, plfold_args=None, rms_sites=None)```

Most arguments are optional and can be skipped. The skipped parameters will default to parameters for experiments with *E. coli* and T7lac promoter. The optimised sequence can be found by running simulated annealing:

```opt_seq = my_opt.simulated_anneal()```

This will return a tuple of optimised sequence, its opening energy, posterior probability of being expressed and input sequence, its opening energy and posterior probability of being expressed. Posterior probability lies between 0.49 and 0.70. 
```
('ATGAAGAAAAGCTTATCCACCAGCGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 9.125085,
 0.6753022458274315,
 'ATGAAGAAATCTCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 14.01474,
 0.5641493557136965)
 ```

A random state such as ```np.random.RandomState(12345)```, where the random number is 12345, can also be passed to ```simulated_anneal()```. This will return the optimised sequence and input sequence with their respective scores and opening energy. If you want the optimised sequence only, you can get it as (make sure you run ```simulated_anneal()``` once):

```
my_opt.annealed_seq
('ATGAAGAAAAGCTTATCCACCAGCGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 9.125085)
```
