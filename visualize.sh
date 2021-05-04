#! /bin/bash
#Personal version of shell command ls which presents to user the list of files with shell command select
#Usage: bstls.sh folder
echo "Scanning the ../measurements folder"
PS3='Which measurements do you want to visualize? '
#command sed substitutes blank spaces with £ in file or folder names
#in this way user can select files or folders with blank spaces in between

list="Exit $(ls ./../measurements | sed 's/ /£/')"
select option in $list
do
    if [ "$option" = "Exit" ] #if user selects Exit, then exit the program
    then
        exit 0
    elif [ -n "$option" ] #if name is valid, shows the files inside
    then
        #reuse sed command to reconvert to original file name
        filename=$(echo "$option" | sed 's/£/ /')
        node ./collectData.js measurements/$filename/csv/
        npx serve -s ./build
        #cd "./measurments/$filename"
        exit 1
    else #if the number of the choice given by user is wrong, exit
        echo "Invalid choice ($REPLY)!"
    fi
done
