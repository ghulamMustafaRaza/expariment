// export const Guard = (prop) => (props) => {
//   console.log(props, prop.check(), auth().currentUser)
//   if (!prop.check()) {
//     (props.history && props.history.goBack) ? props.history.goBack() : (props.router && props.router.goBack) && props.router.goBack()
//   }
//   return <prop.component { ...props } />
// }
// export const GuardedRoute = (props) => {
//   let {
//     check,
//     component,
//     path,
//     exact
//   } = props
//   // delete props.check
//   // delete props.component
//   return <Route exact={exact} path={path} component={Guard({ check: check || (() => true), component })}/>
//   // return <Route path={path} component={<Guard check={check || (() => true)} component={component} />}/>
// }

// export default () => (
//   <Router>
//     <div>
//       <App/>
//       <GuardedRoute check={() => !auth().currentUser} exact path="/" component={() => <h1>App /</h1>}/>
//       <GuardedRoute check={() => auth().currentUser} path="/gm" component={() => <h1>gm /gm</h1>}/>
//     </div>
//   </Router>
// );
export const Loading = () => <h1>Loading</h1>

export class FirebaseAuthGuardRouter extends Component {
  state = {
    loading: true,
    user: null
  }
  componentWillMount() {
    auth().onAuthStateChanged(user => this.setState({ user, loading: false }))
  }
  render() {
    return (
      this.state.loading ? (this.props.loading || <Loading />) :
        <Router>
          <div>
            {this.props.children}
          </div>
        </Router>
    )
  }
}

export const FirebaseAuthGuardRoute = (props) => {
  let {
    authOnly,
    noAuthOnly,
    component,
    path,
    exact
  } = props
  return <Route exact={exact} path={path} component={Guard({
    check: (() => {
      let user = auth().currentUser
      return (authOnly && user && !noAuthOnly) || (!authOnly && !noAuthOnly) ? true : false
    }), component
  })} />
}
export const Guard = (prop) => (props) => {
  console.log(props)
  if (!prop.check()) {
    (props.history && props.history.goBack) ? props.history.goBack() : (props.router && props.router.goBack) && props.router.goBack()
  }
  return <prop.component { ...props } />
}

export default () => (
  <div>
    <FirebaseAuthGuardRouter>
      <App />
      <FirebaseAuthGuardRoute noAuthOnly exact path="/" component={() => <h1>App /</h1>} />
      <FirebaseAuthGuardRoute authOnly path="/gm" component={() => <h1>gm /gm</h1>} />
    </FirebaseAuthGuardRouter>
  </div>
);
