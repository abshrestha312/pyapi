#!/usr/bin/python3
import time
     
def main():
    rightmeow = time.strftime("%Y-%m-%d")
    print('Print year-month-day format:', rightmeow)
         
    exacttime = time.strftime("%Y-%m-%d:%H-%M-%S")
    print("Include the :hour:minute:second timestamp of now:", exacttime)
         
if __name__ == '__main__':
    main()

