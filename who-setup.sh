#!/usr/bin/env bash

[ -d $HOME/bin ] || mkdir $HOME/bin

cp cli/who $HOME/bin/who

[[ ":$PATH:" != *":$HOME/bin:"* ]] && PATH="$HOME/bin:${PATH}"