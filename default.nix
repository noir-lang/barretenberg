{ nixpkgs ? import <nixpkgs> {} }:

nixpkgs.mkShell {
  
  nativeBuildInputs = with nixpkgs; [
    git
    nodejs
    nodePackages.npm
    yarn
    jq
  ];

}