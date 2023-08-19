#!/bin/sh

dot -Tpng -o er_diagram.png er_diagram.dot
dot -Tpdf -o er_diagram.pdf er_diagram.dot
