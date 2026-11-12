// ============================================================
//  ENIGMA DELLA SEQUENZA (SequencePuzzle)
//  Accendi i bracieri nell'ordine giusto. Al primo errore si spengono tutti.
//
//  DOVE SI METTE
//    Trascina PF_Kit_Sequenza (o aggiungilo a un oggetto vuoto).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Order: la lista dei bracieri nell'ordine giusto (trascinali uno per uno).
//    Objective: obiettivo da completare se la sequenza e' giusta (facoltativo).
//    Fail Message e Solved Message: i messaggi.
//    Reset Delay: quanto restano accesi dopo un errore.
//
//  COME SI COLLEGA
//    On Solved: cosa succede quando e' giusta (es. Door.Open).
//    On Failed: cosa succede dopo un errore.
//
//  ESEMPIO
//    Order = tre bracieri, On Solved > Cancello > Door.Open.
// ============================================================
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

/// <summary>Sequenza: accendi i bracieri nell'ordine giusto. Al primo errore si spengono tutti e si riprova.</summary>
public class SequencePuzzle : MonoBehaviour
{
    [Tooltip("I bracieri, nell'ordine giusto")] public BrazierSwitch[] order = new BrazierSwitch[0];
    [Tooltip("Obiettivo da completare quando la sequenza e' giusta (facoltativo)")] public Objective objective;
    [Tooltip("Messaggio dopo un errore (vuoto = nessuno)")] public string failMessage = "Ordine sbagliato: i bracieri si spengono";
    [Tooltip("Messaggio quando la sequenza e' giusta (vuoto = nessuno)")] public string solvedMessage = "";
    public AudioClip failClip, solvedClip;
    [Tooltip("Dopo un errore, per quanti secondi restano accesi prima di spegnersi")] public float resetDelay = 0.8f;
    [Tooltip("Cosa succede quando la sequenza e' giusta (es. Door.Open)")] public UnityEvent onSolved = new UnityEvent();
    [Tooltip("Cosa succede dopo un errore")] public UnityEvent onFailed = new UnityEvent();

    int next; bool solved, resetting;
    public bool IsSolved => solved;

    void Start() { foreach (var b in order) if (b) { var x = b; x.onLit.AddListener(() => OnLit(x)); } }

    void OnLit(BrazierSwitch b)
    {
        if (solved || resetting || order.Length == 0) return;
        if (b != order[next]) { StartCoroutine(Fail()); return; }
        if (++next < order.Length) return;
        solved = true;
        KitAudio.Play(solvedClip, transform.position);
        if (objective) objective.AddProgress();
        if (!string.IsNullOrEmpty(solvedMessage)) GameManager.Instance?.ShowMessage(solvedMessage);
        onSolved.Invoke();
    }

    IEnumerator Fail()
    {
        resetting = true;
        KitAudio.Play(failClip, transform.position);
        if (!string.IsNullOrEmpty(failMessage)) GameManager.Instance?.ShowMessage(failMessage);
        onFailed.Invoke();
        yield return new WaitForSeconds(resetDelay);
        foreach (var b in order) if (b) b.Extinguish();
        next = 0; resetting = false;
    }
}
