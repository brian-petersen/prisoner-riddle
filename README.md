This CLI application simulates a prisoner's dilemma. It was originally a riddle
I came across on YouTube. You can watch it here:
https://www.youtube.com/watch?v=iSNsgj1OCLA&t=902s

The riddle goes as such:

- There are 100 prisoners numbered 1 to 100
- Slips with their numbers are randomly placed in 100 boxes in a room
- Each prisoner may enter the room one at a time and check 50 boxes
- They must leave the room exactly as they found it and can't communicate with
  the others after
- If all 100 prisoners find their number during their turn in the room, they
  will all be freed. But if even one fails, they will all be executed.

What is their best strategy?

The video explains the math behind a random strategy: in which each each
prisoner only has a 50% chance of finding their number since they can only open
half of the boxes. So the more prisoners there are, the more unlikely of being
let free.

Instead, if they utilize a looping strategy, then the group's odds of being let
free increase dramatically. Each Individual's chances of finding their number is
still 50%, but the group's chances are always about 1/3, regardless of the
prison group size.

I coded this up to verify those results -- and they indeed are true!

## Example Trials

```
deno run script.ts --trials 100 --prisoner-count 1000 --strategy loop
0.36
```

In this case, 100 trials were ran with 1,000 prisoners utilizing the `loop`
strategy. 36% of the trials resulted in the prisoners being left free.

## Running

This uses the deno runtime. Third-party libs have been vendored in case they
disappear.

The vendored ones can be used by adding the following flags to the deno runtime:
`--import-map vendor/import_map.json`.
