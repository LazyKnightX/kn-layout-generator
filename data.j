private function updateLayout takes integer id returns nothing
    if id == 1 then
        call setValue("T", 8, 1)
        call setValue("T", 9, 1)
        call setValue("T", 8, 2)
        call setValue("T", 9, 2)
        call setValue("T", 1, 8)
        call setValue("T", 2, 8)
        call setValue("T", 15, 8)
        call setValue("T", 16, 8)
        call setValue("T", 1, 9)
        call setValue("T", 2, 9)
        call setValue("T", 15, 9)
        call setValue("T", 16, 9)
        call setValue("T", 8, 15)
        call setValue("T", 9, 15)
        call setValue("T", 8, 16)
        call setValue("T", 9, 16)
    endif
    if id == 2 then
        call setValue("B", 5, 3)
        call setValue("B", 5, 4)
    endif
    if id == 3 then
        call setValue("T", 16, 8)
        call setValue("T", 16, 9)
        call setValue("T", 8, 16)
        call setValue("T", 9, 16)
    endif
    if id == 4 then
        call setValue("B", 8, 6)
        call setValue("B", 9, 6)
        call setValue("B", 10, 6)
        call setValue("G", 8, 7)
        call setValue("B", 9, 7)
        call setValue("G", 10, 7)
        call setValue("T", 15, 8)
        call setValue("T", 16, 8)
        call setValue("T", 15, 9)
        call setValue("T", 16, 9)
    endif
    if id == 5 then
        call setValue("T", 16, 8)
        call setValue("T", 16, 9)
        call setValue("B", 16, 10)
    endif
    if id == 6 then
        call setValue("B", 3, 3)
        call setValue("B", 12, 5)
        call setValue("B", 13, 5)
        call setValue("B", 14, 5)
        call setValue("T", 16, 9)
        call setValue("G", 6, 11)
    endif
    call BJDebugMsg("Unknown Layout: " + I2S(id))
endfunction
