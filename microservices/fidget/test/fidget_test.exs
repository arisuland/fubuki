defmodule FidgetTest do
  use ExUnit.Case
  doctest Fidget

  test "greets the world" do
    assert Fidget.hello() == :world
  end
end
