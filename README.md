# TIsigner (Translation Initiation coding region designer)
This repository contains source for the following: 
- TIsigner command line version (TIsigner_cmd)
- TIsigner website (TIsigner_web)

TIsigner_web contains the following:
- TIsigner web version ([TIsigner](https://tisigner.otago.ac.nz/tisigner)).
- SoDoPE ([SoDoPE](https://tisigner.otago.ac.nz/sodope)).

The repository to reproduce the results and figures for the preprint: Highly accessible translation initiation sites are predictive of successful heterologous protein expression. *BioRxiv* doi:[10.1101/726752](https://www.biorxiv.org/content/10.1101/726752v1) is available [here](https://github.com/Gardner-BinfLab/TIsigner_paper_2019). TIsigner is based on this preprint.

The repository to reproduce the results and figures for the preprint: Protein solubility is controlled by global structural flexibility. *BioRxiv*. DOI:  is available [here](https://github.com/Gardner-BinfLab/SoDoPE_paper_2019). SoDoPE is based on this preprint.

##### Dependencies
You need to have python 3.6+ installed. The required python dependencies can be installed by

```pip3  install --user -r requirements.txt ```

We also require ViennaRNA suite to be installed on your machine. The instructions to do so can be found [here](https://www.tbi.univie.ac.at/RNA/documentation.html#install).
###### Optional
TIsigner can also check for terminators if you have Infernal installed on your machine. Instructions to install Infernal can be found [here](http://eddylab.org/infernal/).

```requirements.txt``` and further intructions for setting up command line and web version are in respective directory. 

© [Bikash Kumar Bhandari](https://bkb3.github.io), [Chun Shem Lim](https://github.com/lcscs12345), [Paul P Gardner](https://github.com/ppgardne) (2019)
