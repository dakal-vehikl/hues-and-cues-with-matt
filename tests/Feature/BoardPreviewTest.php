<?php

test('the board preview page loads', function () {
    $this->get(route('board.preview'))->assertOk();
});
