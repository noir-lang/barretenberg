{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  
  nativeBuildInputs = with pkgs; [
    git
    nodejs
    nodePackages.npm
    yarn
    jq
  ];

}