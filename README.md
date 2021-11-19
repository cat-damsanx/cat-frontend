# Computerized Adaptive Testing front end

This is the front end version of computerized adaptive testing for show isolated question at each time, currently this respository is use for math testing, so it support the latex for display formula to user.

This respository is fork from [this](https://github.com/hdieuhuy/render-latex-ver3.git) respository, which is my colleague.

## To start project

### `yarn run dev`

## Things to consider
- [X] Fix case when user has estimated ability at **bound (min or max)**, but click right choice for twice time, it's block the server. (not update variable to trigger the useEffect function at bound)
    => I fix it by considering `thetaPattern` at useEffect function.