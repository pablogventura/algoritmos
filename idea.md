estudiar algoritmos y aplicarlos en investigación
Viernes, 19 junio⋅18:30 – 19:30
Te diría que un doctor en computación no necesita “memorizar” todos, sino tener un mapa operativo: saber qué problema resuelve cada familia, qué garantías da, cuándo falla y qué estructuras de datos necesita. Como corpus base: Introduction to Algorithms es la referencia estándar universitaria/profesional; la 4.ª edición agrega, entre otras cosas, emparejamientos bipartitos, algoritmos en línea, aprendizaje automático y arreglos de sufijos; Algorithms de Sedgewick y Wayne cubre algoritmos y estructuras de datos de uso actual; y The Art of Computer Programming de Knuth sigue siendo la referencia clásica profunda. 

1. Patrones que tenés que reconocer al vuelo

Patrón	Algoritmos / técnicas clave

Fuerza bruta inteligente	enumeración, poda, meet-in-the-middle
Divide y vencerás	mergesort, quicksort, búsqueda binaria, closest pair
Programación dinámica	mochila, edición, Floyd-Warshall, Held-Karp, Viterbi
Voraces	Huffman, Kruskal, Prim, interval scheduling
Backtracking	SAT simple, N-reinas, coloreo, CSP
Branch and bound	TSP exacto, integer programming básico
Aleatorizados	quicksort aleatorizado, Miller-Rabin, hashing universal
Amortizados	union-find, tablas dinámicas, splay trees
Aproximación	set cover greedy, vertex cover 2-aprox, Christofides
Online	caching, ski rental, paging
Streaming	reservoir sampling, Count-Min Sketch, HyperLogLog
Paralelos	prefix-sum, map-reduce, work/span, parallel BFS
Distribuidos	consenso, leader election, gossip, snapshot distribuido


2. Ordenamiento, búsqueda y selección

Imprescindibles:

binary search

linear search con centinela

quicksort

mergesort

heapsort

introsort

timsort

counting sort

radix sort

bucket sort

selection algorithm

median-of-medians

quickselect

external sorting

top-k con heap

búsqueda exponencial

interpolation search


Acá importa mucho saber modelo de memoria, estabilidad, adaptatividad, peor caso y comportamiento de caché.

3. Estructuras de datos con sus algoritmos

Tenés que manejar bien:

arrays dinámicos

listas enlazadas

pilas

colas

colas de prioridad

heaps binarios

heaps d-arios

binomial heaps

Fibonacci heaps

hash tables

hashing universal

Robin Hood hashing

cuckoo hashing

Bloom filters

Count-Min Sketch

HyperLogLog

union-find / disjoint set union

árboles binarios de búsqueda

AVL

red-black trees

splay trees

treaps

skip lists

B-trees

B+ trees

tries

radix trees

segment trees

Fenwick trees

sparse tables

suffix arrays

suffix trees


Para sistemas, bases de datos e IoT, los B-trees/B+ trees, heaps, hashing, Bloom filters y estructuras compactas son particularmente importantes.

4. Grafos: el núcleo duro

Estos son obligatorios:

BFS

DFS

orden topológico

componentes conexas

componentes fuertemente conexas: Kosaraju, Tarjan

puntos de articulación

puentes

componentes biconexas

caminos mínimos:

Dijkstra

Bellman-Ford

Floyd-Warshall

Johnson

A*

bidirectional search


árbol generador mínimo:

Kruskal

Prim

Borůvka


flujo máximo:

Ford-Fulkerson

Edmonds-Karp

Dinic

push-relabel


min-cost max-flow

cortes mínimos

matching:

Hopcroft-Karp

algoritmo húngaro

Blossom


PageRank

algoritmos de centralidad

detección de ciclos

Eulerian path

TSP:

Held-Karp

Christofides

2-opt / 3-opt

simulated annealing para heurísticas



Si enseñás Redes, agregaría con especial énfasis:

Dijkstra y Bellman-Ford como base de ruteo

flooding controlado

spanning tree protocol, conceptualmente

gossip protocols

consistent hashing

leader election

consensus / Paxos / Raft


5. Strings, parsing y autómatas

Muy importantes para compiladores, bioinformática, búsqueda, logs y herramientas:

KMP

Boyer-Moore

Rabin-Karp

Aho-Corasick

Z-algorithm

prefix-function

suffix array

suffix tree

LCP array

Burrows-Wheeler Transform

FM-index

Levenshtein distance

Needleman-Wunsch

Smith-Waterman

Myers diff

Thompson construction para expresiones regulares

subset construction NFA → DFA

minimización de DFA

CYK parsing

Earley parser

LL/LR parsing


Para tu perfil lógico-matemático, autómatas y parsing son una zona muy fértil.

6. Lógica, SAT, CSP y razonamiento automático

Acá pondría:

resolución proposicional

resolución de primer orden

unificación de Robinson

DPLL

CDCL

watched literals

unit propagation

pure literal elimination

Davis-Putnam

WalkSAT

arc consistency: AC-3

backjumping

constraint propagation

congruence closure

Nelson-Oppen

tableaux

model checking:

explicit-state

symbolic model checking con BDD


algoritmos sobre BDD

algoritmos de minimización de fórmulas

chase, en bases de datos/lógica

homomorphism checking

substructure / subisomorphism search

Weisfeiler-Leman, por conexión con isomorfismo y lógica finita


Esta sección es probablemente la más “tuya”: definibilidad, estructuras finitas, subisomorfismos, CSP y teoría de modelos finitos se tocan muchísimo.

7. Compresión, codificación e información

Tenés que conocer:

Huffman coding

arithmetic coding

Lempel-Ziv: LZ77, LZ78, LZW

run-length encoding

Burrows-Wheeler + move-to-front

delta encoding

Elias gamma/delta coding

Golomb/Rice coding

Reed-Solomon

Hamming codes

CRC

Viterbi decoding

LDPC, al menos conceptualmente


Para IoT esto no es ornamental: compresión, CRC y codificación aparecen todo el tiempo en protocolos, firmware y transmisión ruidosa.

8. Criptografía y seguridad

No como “usar librerías”, sino entender los algoritmos:

Euclides extendido

exponenciación modular rápida

Miller-Rabin

RSA

Diffie-Hellman

ElGamal

curvas elípticas, conceptualmente

ECDSA / EdDSA, conceptualmente

AES

ChaCha20

Poly1305

SHA-2 / SHA-3

HMAC

PBKDF2

Argon2

Merkle trees

Bloom filters criptográficos / acumuladores, como cultura general

secret sharing de Shamir

zero-knowledge proofs, al menos Schnorr y zk-SNARKs conceptualmente


9. Numéricos y álgebra lineal

Un doctor en computación debería conocer al menos:

eliminación gaussiana

LU

Cholesky

QR

SVD

eigenvalue algorithms

power iteration

Lanczos

conjugate gradient

GMRES

Newton-Raphson

bisección

secante

Runge-Kutta

Euler explícito/implícito

FFT

NTT

Strassen

Karatsuba

Montgomery multiplication

automatic differentiation

Kalman filter

particle filter

Monte Carlo

quasi-Monte Carlo


La clave no es sólo complejidad: también estabilidad numérica, condicionamiento y errores de redondeo.

10. Optimización

Fundamentales:

gradient descent

stochastic gradient descent

momentum

Adam

Newton

quasi-Newton / BFGS

coordinate descent

simplex

interior point methods

branch and cut

cutting planes

Lagrange multipliers

ADMM

simulated annealing

genetic algorithms

tabu search

hill climbing

expectation-maximization


Para ML, control e IoT, esta familia aparece en entrenamiento, calibración, planificación y estimación.

11. Aprendizaje automático

Los algoritmos que sí o sí deberías reconocer:

k-nearest neighbors

naive Bayes

logistic regression

linear regression

ridge / lasso

decision trees

random forests

gradient boosting

XGBoost / LightGBM, conceptualmente

SVM

k-means

DBSCAN

Gaussian mixture models

PCA

t-SNE

UMAP

backpropagation

dropout

batch normalization

transformers

attention

beam search

Viterbi

reinforcement learning:

value iteration

policy iteration

Q-learning

Monte Carlo tree search



Dado tu perfil, yo priorizaría modelos explicables, algoritmos de optimización, representación simbólica y ML en el borde antes que aprender “recetas de Kaggle”.

12. Sistemas operativos y concurrencia

Muy importantes para docencia y práctica real:

scheduling:

round-robin

priority scheduling

shortest job first

multilevel feedback queue

fair scheduling


page replacement:

FIFO

LRU

Clock

working set


deadlock detection

banker’s algorithm

semáforos

monitores

spinlocks

lock-free algorithms

compare-and-swap

hazard pointers

RCU

two-phase commit

write-ahead logging

log-structured merge trees

garbage collection:

mark-and-sweep

copying collector

generational GC

reference counting



13. Bases de datos

Indispensables:

B+ trees

hash joins

sort-merge join

nested-loop join

query optimization dinámica estilo Selinger

cost-based optimization

two-phase locking

MVCC