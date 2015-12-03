class Edges
	def initialize
		@fwd = {}
		@back = {}
	end

	def []=(from, to, value)
		@fwd[from] = @fwd[from] || {}
		@back[to] = @back[to] || {}
		@fwd[from][to] = value
		@back[to][from] = value
	end

	def [](from, to)
		@fwd[from][to]
	end
end

class Graph
	def initialize
		@edges = Edges.new
		@nodes = {}
	end

	def []=(label, value)
		@nodes[label] = value
	end

	def [](label, toLabel=nil)
		if not toLabel
			@nodes[label]
		else
			@edges[label, toLabel]
		end
	end

	def join(from, to, data)
		@edges[from, to] = data
	end
end

g = Graph.new


g['a'] = 'hello'
g['b'] = 'world'

g.join('a', 'b', {weight: 10})

p g['a', 'b']
p g
