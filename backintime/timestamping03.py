#!/usr/bin/python3
import time
    
def main():
    rightmeow = time.strftime("%Y-%m-%d")
    with open(rightmeow + '-example.txt', 'w') as f:
        f.write('File with current date created!\n')
    
    hourtime = time.strftime("%H")
    with open(hourtime + '-example.txt', 'w') as f:
        f.write('File with hour timestamp created!\n')
      
    yearmonth = time.strftime("%Y-%B")
    with open(yearmonth + '-reporting.txt', 'w') as f:
        f.write('File with monthly timestamp created!\n')
    
if __name__ == '__main__':
    main()

