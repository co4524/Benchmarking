'''
# USEAGE: python [input.toml] [output.toml]
# This program ignores comments in input.toml and dump the result to output.toml as file
'''
import sys
import toml

filename = sys.argv[1]
newname = sys.argv[2]
f = open(filename, 'r')
cfg = toml.load(f)
f = open(newname, 'w')
toml.dump(cfg, f)
f.close()
